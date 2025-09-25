"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelService = void 0;
const Travel_1 = require("../models/Travel");
const firestore_1 = require("@google-cloud/firestore");
class TravelService {
    constructor() {
        this.firestore = new firestore_1.Firestore();
    }
    async validateTravel(request) {
        try {
            const validationErrors = [];
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
            const travel = {
                userId: request.userId,
                vehicleId: request.vehicleId,
                origin: request.origin,
                destination: request.destination,
                startTime: new Date(),
                status: Travel_1.TravelStatus.VALIDATED,
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
        }
        catch (error) {
            console.error('Error validating travel:', error);
            return {
                isValid: false,
                message: 'Internal server error during validation'
            };
        }
    }
    isValidLocation(location) {
        return !!(location &&
            typeof location.latitude === 'number' &&
            typeof location.longitude === 'number' &&
            location.latitude >= -90 && location.latitude <= 90 &&
            location.longitude >= -180 && location.longitude <= 180 &&
            location.address && location.address.trim() !== '');
    }
    async checkVehicleAvailability(vehicleId) {
        try {
            const vehicleDoc = await this.firestore.collection('vehicles').doc(vehicleId).get();
            if (!vehicleDoc.exists) {
                return false;
            }
            const vehicleData = vehicleDoc.data();
            return vehicleData?.status === 'available';
        }
        catch (error) {
            console.error('Error checking vehicle availability:', error);
            return false;
        }
    }
    calculateDistance(origin, destination) {
        const R = 6371;
        const dLat = this.deg2rad(destination.latitude - origin.latitude);
        const dLon = this.deg2rad(destination.longitude - origin.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(origin.latitude)) * Math.cos(this.deg2rad(destination.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    calculateFare(distance) {
        const baseFare = 2.5;
        const perKmRate = 1.2;
        return baseFare + (distance * perKmRate);
    }
}
exports.TravelService = TravelService;
//# sourceMappingURL=TravelService.js.map