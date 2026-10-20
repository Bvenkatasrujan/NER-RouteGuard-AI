export type AIRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AIAnalysisStatus = 'COMPLETED' | 'FAILED';

export interface AIAnalysisDoc {
  analysisId: string;
  reportId: string;
  hazard: string;
  riskScore: number; // 0–100
  riskLevel: AIRiskLevel;
  disruptionProbability: number; // 0–1
  affectedRoad: string;
  affectedRoadId: string;
  analysisStatus: AIAnalysisStatus;
  modelName: string;
  modelVersion: string;
  analyzedAt?: any;
  updatedAt?: any;
}

export type RouteStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type CoordinateMapObject = { longitude: number; latitude: number } | { lng: number; lat: number };

export interface RouteGeometry {
  type: 'LineString';
  coordinates: Array<CoordinateMapObject> | Array<[number, number]>;
}

export interface RouteDoc {
  routeId: string;
  reportId: string;
  analysisId: string;
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  geometry: RouteGeometry;
  distanceKm: number;
  estimatedTravelTimeMinutes: number;
  riskScore: number;
  riskLevel: string;
  affectedRoad: string;
  routeStatus: RouteStatus;
  routeType?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MapGuardRouteResponse {
  success: boolean;
  routeId: string;
  routeStatus: RouteStatus;
  routeType: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  distanceKm: number;
  estimatedTravelTimeMinutes: number;
  riskScore: number;
  riskLevel: string;
  affectedRoad: string;
  geometry: RouteGeometry;
  error?: string;
}

export interface TrackingDoc {
  trackingId: string;
  routeId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp?: any;
}

// Backwards compatibility types for legacy helper functions
export interface RouteRequest {
  vehicle_id?: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
}

export interface RouteOption {
  route_id: string;
  type?: string;
  title?: string;
  distance_km: number;
  eta_minutes: number;
  risk_score: string;
  risk_level?: string;
  reason?: string;
  hazards_avoided_count?: number;
  hazards_avoided_types?: (string | undefined)[];
  affected_roads_avoided?: string[];
  polyline_coords?: Array<{ latitude: number; longitude: number }>;
}

export interface RouteOptimizationResponse {
  recommended_route_id: string;
  options: RouteOption[];
  has_active_hazards: boolean;
}
