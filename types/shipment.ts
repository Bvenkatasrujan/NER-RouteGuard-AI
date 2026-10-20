export interface DriverAssignment {
  assignmentId: string;
  driverId: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  shipmentId: string;
  cargoType: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  origin: {
    name: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    name: string;
    latitude: number;
    longitude: number;
  };
  status: 'ASSIGNED' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED';
  routeId?: string;
  riskScore?: string;
}
