import { Request, Response, NextFunction } from 'express';
import { assignService, getServiceById } from '../services/service-charge.service';

// Assign service to user
export const assignServiceToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, serviceId, slabs } = req.body;
    
    if (!userId || !serviceId || !slabs) {
      res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
      return;
    }
    
    const assignedService = await assignService(userId, serviceId, slabs);
    
    res.status(201).json({
      success: true,
      message: 'Service assigned successfully',
      data: assignedService
    });
  } catch (error) {
    next(error);
  }
};

// Get service by ID
export const getService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, serviceId } = req.params;
    
    const service = await getServiceById(userId, serviceId);
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};