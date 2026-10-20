export type WeatherCondition =
  | 'CLEAR'
  | 'CLOUDY'
  | 'RAIN'
  | 'HEAVY_RAIN'
  | 'STORM'
  | 'FOG'
  | 'SNOW'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'PENDING_AI_ANALYSIS'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'ANALYSIS_FAILED'
  | 'ACTIVE'
  | 'RESOLVED'
  | 'PENDING_SYNC'
  | 'SUBMITTED';

export interface IncidentReportDoc {
  reportId: string;
  officerId: string;
  weather: WeatherCondition;
  hazardDescription: string;
  severity: IncidentSeverity;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  createdAt?: any;
  updatedAt?: any;
}

// Backwards compatibility interface for legacy component state
export interface IncidentReport extends Partial<IncidentReportDoc> {
  incident_id?: string;
  incident_type?: string;
  hazard_type?: string;
  description?: string;
  location_name?: string;
  nearest_road?: string;
  road_status?: string;
  state?: string;
  district?: string;
  affected_length_m?: number;
  photo_url?: string;
  reporter_id?: string;
  reporter_name?: string;
  reporter_role?: string;
  reported_by?: string;
  created_at?: string;
  ai_processed?: boolean;
  ai_analysis?: any;
}
