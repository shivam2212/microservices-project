import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { sendTransactionToQueue, createTransaction, getUserTransactions } from '../services/transaction.service';
import { ValidationError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';

// Helper function to get auth headers
const getAuthHeaders = (req: Request) => {
  const token = req.headers.authorization || '';
  return {
    Authorization: token,
  };
};

// Create a new transaction
export const initiateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, amount, serviceId } = req.body;

    if (!userId || !amount || !serviceId) {
      throw new ValidationError('All fields are required');
    }

    // Get auth headers for service calls
    const headers = getAuthHeaders(req);

    // Get service details to calculate charges
    const serviceResponse = await axios.get(
      `${process.env.SERVICE_CHARGE_SERVICE_URL}/api/services/${userId}/${serviceId}`,
      { headers }
    );

    if (!serviceResponse.data.success) {
      throw new ValidationError('Service not found');
    }

    const service = serviceResponse.data.data;
    console.log(service);
    // Calculate service charge based on slabs
    // const serviceChargeResponse = await axios.post(
    //   `${process.env.SERVICE_CHARGE_SERVICE_URL}/api/services/calculate`,
    //   { amount, slabs: service.slabs },
    //   { headers }
    // );

    const serviceCharge =  calculateServiceCharge(service.slabs, amount)

    const gst = calculateGST(serviceCharge ? serviceCharge : 0);

    // Validate wallet and create transaction
    const transactionData = {
      userId,
      amount,
      serviceId,
      serviceCharge,
      gst,
      // These will be updated by the queue service
      prevBalance: 0,
      updatedBalance: 0,
      status: 'initiated'
    };

    // Send to queue for processing
    await sendTransactionToQueue(transactionData);

    res.status(202).json({
      success: true,
      message: 'Transaction initiated and queued for processing',
    });
  } catch (error) {
    logger.error('Transaction initiation error:', error);
    next(error);
  }
};

// Get user transactions
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const transactions = await getUserTransactions(userId);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

function calculateServiceCharge(slabs: string, amount: number) {
  const slabArr = slabs.split('/');

  for (let slab of slabArr) {
    const [min, max, charge, unit] = slab.split('_');

    const minAmount = parseFloat(min);
    const maxAmount = parseFloat(max);
    const chargeValue = parseFloat(charge);

    if (amount >= minAmount && amount <= maxAmount) {
      return chargeValue;
    }
  }

  return null; // No matching slab
}

function calculateGST(serviceCharge: number): number {
  const gstRate = 0.18;
  return parseFloat((serviceCharge * gstRate).toFixed(2));
}