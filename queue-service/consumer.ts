import axios from 'axios';
import { Channel, ConsumeMessage } from 'amqplib';
import { logger } from '../common/src/utils/logger';
import { createModels } from '../common/src/models';  // Import createModels
import { calculateServiceCharge, calculateGST } from '../service-charge-service/src/services/service-charge.service';
import mongoose from 'mongoose';  // Import mongoose for DB connection

interface TransactionRequest {
  userId: string;
  amount: number;
  serviceId: string;
}

export const createConsumer = (channel: Channel, connection: mongoose.Connection) => {
  // Create models from the connection
  const { Wallet, Service, Transaction } = createModels(connection);

  channel.consume('transaction_queue', async (msg: ConsumeMessage | null) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info(`Processing transaction for user: ${content.userId}`);

        await processTransaction(content, Wallet, Service, Transaction);

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        logger.error('Error processing message:', error);
        // Nack the message and requeue
        channel.nack(msg, false, true);
      }
    }
  });

  logger.info('RabbitMQ consumer started');
};

const processTransaction = async (
  transactionRequest: TransactionRequest,
  Wallet: mongoose.Model<any>,
  Service: mongoose.Model<any>,
  Transaction: mongoose.Model<any>
) => {
  const { userId, amount, serviceId } = transactionRequest;

  // 1. Validate wallet
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error(`Wallet not found for user: ${userId}`);
  }

  // Calculate available balance
  const availableBalance = wallet.balance - wallet.hold;

  // Check min/max limits
  if (amount < wallet.minLimit) {
    throw new Error(`Amount is below minimum limit of ${wallet.minLimit}`);
  }

  if (amount > wallet.maxLimit) {
    throw new Error(`Amount exceeds maximum limit of ${wallet.maxLimit}`);
  }

  // Check if sufficient balance
  if (availableBalance < amount) {
    throw new Error(`Insufficient balance. Available: ${availableBalance}, Required: ${amount}`);
  }

  // 2. Get service charge details
  const serviceCharge = await Service.findOne({ userId, serviceId });
  if (!serviceCharge) {
    throw new Error(`Service charge not found for user: ${userId} and service: ${serviceId}`);
  }

  // 3. Calculate service charge
  const chargeAmount = calculateServiceCharge(serviceCharge.slab,amount);
  const gstAmount    = calculateGST(chargeAmount);
  const totalDeduction = amount + chargeAmount + gstAmount;

  // 4. Update wallet
  const prevBalance = wallet.balance;
  wallet.balance -= totalDeduction;
  await wallet.save();

  // 5. Create transaction with "initiated" status
  const transaction = await Transaction.create({
    userId,
    amount,
    serviceCharge: chargeAmount,
    gstAmount,
    prevBalance,
    updatedBalance: wallet.balance,
    serviceId,
    status: 'initiated'
  });

  // 6. Call dummy bank API
  try {
    const response = await axios.post(`${process.env.DUMMY_BANK_API_URL}/process`, {
      transactionId: transaction._id,
      amount,
      userId
    });

    if (response.data.status === 'acknowledged') {
      // 7. Update transaction status to "awaited"
      transaction.status = 'awaited';
      await transaction.save();
      logger.info(`Transaction ${transaction._id} updated to "awaited" status`);
    } else {
      // If bank API returns an error status
      transaction.status = 'failed';
      await transaction.save();
      logger.error(`Transaction ${transaction._id} failed at bank API`);

      // Refund the amount to wallet
      wallet.balance = prevBalance;
      await wallet.save();
    }
  } catch (error) {
    // API call failed, refund and mark as failed
    logger.error(`Error calling dummy bank API:`, error);
    transaction.status = 'failed';
    await transaction.save();

    // Refund the amount to wallet
    wallet.balance = prevBalance;
    await wallet.save();
  }
};
