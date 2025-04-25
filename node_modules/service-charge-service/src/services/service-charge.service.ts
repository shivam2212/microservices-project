import mongoose from 'mongoose';
import { getDBName } from '../../../common/src/utils/db';
import { createModels } from '../../../common/src/models';
import { NotFoundError, ValidationError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';
import { Service } from '../../../common/src/interfaces';

// Parse slab string to calculate service charge
export const calculateServiceCharge = (slabString: string, amount: number): number => {
  // Example slabs: "50_1000_2.5_rupees/1001_5000_5_rupees"
  const slabs = slabString.split('/');
  
  for (const slab of slabs) {
    const [minAmount, maxAmount, chargeValue, chargeType] = slab.split('_');
    const min = parseInt(minAmount);
    const max = parseInt(maxAmount);
    
    if (amount >= min && amount <= max) {
      const charge = parseFloat(chargeValue);
      
      if (chargeType.includes('rupees')) {
        return charge; // Fixed amount
      } else if (chargeType.includes('percent')) {
        return (amount * charge) / 100; // Percentage
      }
    }
  }
  
  throw new ValidationError('No matching slab found for the amount');
};

// Calculate GST (18% on service charges)
export const calculateGST = (serviceCharge: number): number => {
  return serviceCharge * 0.18;
};

// Assign service to a user
export const assignService = async (
  userId: string,
  serviceId: string,
  slabs: string
): Promise<Service> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  // Check if service already exists for this user
  const existingService = await models.Service.findOne({ userId, serviceId });
  
  if (existingService) {
    // Update slabs for existing service
    const updatedService = await models.Service.findOneAndUpdate(
      { userId, serviceId },
      { slabs },
      { new: true }
    );
    
    await conn.close();
    return updatedService as Service;
  } else {
    // Create new service
    const newService = new models.Service({
      userId,
      serviceId,
      slabs
    });
    
    await newService.save();
    await conn.close();
    return newService;
  }
};

// Get service by ID for a user
export const getServiceById = async (userId: string, serviceId: string): Promise<Service> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const service = await models.Service.findOne({ userId, serviceId });
  
  await conn.close();
  
  if (!service) {
    throw new NotFoundError('Service not found');
  }
  
  return service;
};


// shivam - may this file is not needed, this functionality has been applied in transaction-service itself.