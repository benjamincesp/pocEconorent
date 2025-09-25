export interface Travel {
  id?: string;
  userId: string;
  vehicleId: string;
  origin: Location;
  destination: Location;
  startTime: Date;
  endTime?: Date;
  distance?: number;
  status: TravelStatus;
  fare?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export enum TravelStatus {
  REQUESTED = 'requested',
  VALIDATED = 'validated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface TravelValidationRequest {
  userId: string;
  vehicleId: string;
  origin: Location;
  destination: Location;
  estimatedDuration?: number;
}

export interface TravelValidationResponse {
  isValid: boolean;
  message: string;
  travelId?: string;
  estimatedFare?: number;
  validationErrors?: string[];
}