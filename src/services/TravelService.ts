import { Travel, TravelValidationRequest, TravelValidationResponse, TravelStatus, Location } from '../models/Travel';
import { Firestore } from '@google-cloud/firestore';

export class TravelService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  async validateTravel(request: TravelValidationRequest): Promise<TravelValidationResponse> {
    try {
      const validationErrors: string[] = [];

      if (!this.isValidLocation(request.origin)) {
        validationErrors.push('Invalid origin location');
      }

      if (!this.isValidLocation(request.destination)) {
        validationErrors.push('Invalid destination location');
      }

      if (!request.userId || request.userId.trim() === '') {
        validationErrors.push('User ID is required');
      }

      if (!request.vehicleId || request.vehicleId.trim() === '') {
        validationErrors.push('Vehicle ID is required');
      }

      if (validationErrors.length > 0) {
        return {
          isValid: false,
          message: 'Validation failed',
          validationErrors
        };
      }

      const isVehicleAvailable = await this.checkVehicleAvailability(request.vehicleId);
      if (!isVehicleAvailable) {
        return {
          isValid: false,
          message: 'Vehicle is not available'
        };
      }

      const distance = this.calculateDistance(request.origin, request.destination);
      const estimatedFare = this.calculateFare(distance);

      const travel: Travel = {
        userId: request.userId,
        vehicleId: request.vehicleId,
        origin: request.origin,
        destination: request.destination,
        startTime: new Date(),
        status: TravelStatus.VALIDATED,
        distance,
        fare: estimatedFare
      };

      const docRef = await this.firestore.collection('travels').add(travel);

      return {
        isValid: true,
        message: 'Travel validated successfully',
        travelId: docRef.id,
        estimatedFare
      };

    } catch (error) {
      console.error('Error validating travel:', error);
      return {
        isValid: false,
        message: 'Internal server error during validation'
      };
    }
  }

  private isValidLocation(location: Location): boolean {
    return !!(location &&
           typeof location.latitude === 'number' &&
           typeof location.longitude === 'number' &&
           location.latitude >= -90 && location.latitude <= 90 &&
           location.longitude >= -180 && location.longitude <= 180 &&
           location.address && location.address.trim() !== '');
  }

  private async checkVehicleAvailability(vehicleId: string): Promise<boolean> {
    try {
      const vehicleDoc = await this.firestore.collection('vehicles').doc(vehicleId).get();
      if (!vehicleDoc.exists) {
        return false;
      }
      const vehicleData = vehicleDoc.data();
      return vehicleData?.status === 'available';
    } catch (error) {
      console.error('Error checking vehicle availability:', error);
      return false;
    }
  }

  private calculateDistance(origin: Location, destination: Location): number {
    const R = 6371;
    const dLat = this.deg2rad(destination.latitude - origin.latitude);
    const dLon = this.deg2rad(destination.longitude - origin.longitude);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(origin.latitude)) * Math.cos(this.deg2rad(destination.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private calculateFare(distance: number): number {
    const baseFare = 2.5;
    const perKmRate = 1.2;
    return baseFare + (distance * perKmRate);
  }
}