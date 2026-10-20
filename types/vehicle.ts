export type VehicleType =
  | 'Ambulance'
  | 'Relief Truck'
  | 'Rescue Vehicle'
  | 'Fire & Rescue Truck'
  | 'Engineering Vehicle'
  | 'Patrol Vehicle';

export type VehicleMode =
  | 'EMERGENCY'
  | 'RELIEF'
  | 'RESCUE'
  | 'RECOVERY'
  | 'MONITORING';

export type VehicleStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED';

export interface Vehicle {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: VehicleType;
  vehicle_mode: VehicleMode;
  capacity: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  assigned_driver_id?: string;
  assigned_driver_name?: string;
  current_route_id?: string;
}
