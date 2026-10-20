export type UserRole = 'ADMIN' | 'FIELD_OFFICER' | 'DRIVER' | 'driver' | 'field_officer';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  status: UserStatus;
  createdAt?: any;
  updatedAt?: any;

  // Optional profile UI compatibility fields
  district?: string;
  jurisdiction?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  assignedVehicleId?: string;
  licenseNumber?: string;
  officerId?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  region?: string;
  emailVerified?: boolean;
  profileCompleted?: boolean;
  onboardingCompleted?: boolean;
  locationPermissionGranted?: boolean;
  notificationPermissionGranted?: boolean;
}

export interface User extends UserProfile {
  id?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  requestedRole?: UserRole;
}
