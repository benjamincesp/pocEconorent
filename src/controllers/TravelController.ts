import { Request, Response } from 'express';
import { TravelService } from '../services/TravelService';
import { TravelValidationRequest } from '../models/Travel';

export class TravelController {
  private travelService: TravelService;

  constructor() {
    this.travelService = new TravelService();
  }

  validateTravel = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('llego');
      const validationRequest: TravelValidationRequest = req.body;

      if (!validationRequest) {
        res.status(400).json({
          error: 'Request body is required'
        });
        return;
      }

      const result = await this.travelService.validateTravel(validationRequest);

      if (result.isValid) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Error in validateTravel controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while validating the travel'
      });
    }
  };
}