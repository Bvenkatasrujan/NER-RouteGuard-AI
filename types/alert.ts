export interface DriverAlert {
  alertId: string;
  driverId: string;
  type: 'ROUTE_RISK' | 'HAZARD_WARNING' | 'WEATHER_ALERT' | 'SYSTEM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  routeId?: string;
  incidentId?: string;
  read: boolean;
  createdAt: any;
}
