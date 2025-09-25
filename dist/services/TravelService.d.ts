import { TravelValidationRequest, TravelValidationResponse } from '../models/Travel';
export declare class TravelService {
    private firestore;
    constructor();
    validateTravel(request: TravelValidationRequest): Promise<TravelValidationResponse>;
    private isValidLocation;
    private checkVehicleAvailability;
    private calculateDistance;
    private deg2rad;
    private calculateFare;
}
//# sourceMappingURL=TravelService.d.ts.map