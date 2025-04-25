import { Request, Response, NextFunction } from 'express';
import { getWalletByUserId, updateWalletBalance } from '../services/wallet.service';
import { logger } from '../../../common/src/utils/logger';

// Get wallet
export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const wallet = await getWalletByUserId(userId);
    
    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

// Top up wallet
export const topUpWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const  userId  = req.params.userId;
    const  amount  = parseInt(req.params.topup);
    
    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }
    
    const wallet = await updateWalletBalance(userId, amount, 'add');
    
    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      data: wallet
    });
    return; 
  } catch (error) {
    next(error);
  }
};