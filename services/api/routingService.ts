import { RouteRequest, RouteOptimizationResponse, RouteOption } from '../../types/routing';
import { IncidentReport } from '../../types/incident';

export class RoutingService {
  calculateRoute(request: RouteRequest, activeIncidents: IncidentReport[]): RouteOptimizationResponse {
    const origin = request.origin;
    const destination = request.destination;

    // Check if any active incident affects the route corridor
    const nh13Incidents = activeIncidents.filter(
      (inc) => inc.nearest_road?.includes('NH-13') || inc.location_name?.includes('Bomdila') || inc.location_name?.includes('Dirang')
    );

    const hasHighRiskNH13 = nh13Incidents.some(
      (inc) => inc.severity === 'HIGH' || inc.severity === 'CRITICAL' || inc.road_status === 'BLOCKED' || inc.road_status === 'PARTIALLY_BLOCKED'
    );

    // Direct / Fastest Route (passing through NH-13)
    const fastestPolyline = [
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: 27.3500, longitude: 92.2500 }, // NH-13 Corridor
      { latitude: destination.latitude, longitude: destination.longitude },
    ];

    // Safe Bypass Route (avoiding NH-13 high-risk segment via accessible valley bypass)
    const safestPolyline = [
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: 27.2000, longitude: 92.1500 }, // Accessible West Bypass
      { latitude: 27.4500, longitude: 92.0500 },
      { latitude: destination.latitude, longitude: destination.longitude },
    ];

    const safestOption: RouteOption = {
      route_id: 'route_safe_' + Date.now(),
      type: 'SAFEST',
      title: 'SAFEST CORRIDOR',
      distance_km: 114.2,
      eta_minutes: 195, // 3h 15m
      risk_score: 'LOW',
      hazards_avoided_count: nh13Incidents.length || 1,
      hazards_avoided_types: nh13Incidents.map((i) => i.incident_type),
      affected_roads_avoided: ['NH-13 (Bomdila — Dirang Segment)'],
      reason: 'RouteGuard avoided the reported landslide/hazard segment on NH-13 and selected an alternative accessible corridor.',
      polyline_coords: safestPolyline,
    };

    const fastestOption: RouteOption = {
      route_id: 'route_fast_' + Date.now(),
      type: 'FASTEST',
      title: 'DIRECT HIGHWAY (RISK AHEAD)',
      distance_km: 96.8,
      eta_minutes: 165,
      risk_score: hasHighRiskNH13 ? 'HIGH' : 'MEDIUM',
      hazards_avoided_count: 0,
      hazards_avoided_types: [],
      affected_roads_avoided: [],
      reason: hasHighRiskNH13
        ? 'WARNING: Passes directly through high-risk NH-13 landslide zone.'
        : 'Direct highway route with potential monsoon slowdowns.',
      polyline_coords: fastestPolyline,
    };

    const balancedOption: RouteOption = {
      route_id: 'route_bal_' + Date.now(),
      type: 'BALANCED',
      title: 'BALANCED ROUTE',
      distance_km: 104.5,
      eta_minutes: 180,
      risk_score: 'MEDIUM',
      hazards_avoided_count: Math.max(0, nh13Incidents.length - 1),
      hazards_avoided_types: nh13Incidents.slice(1).map((i) => i.incident_type),
      affected_roads_avoided: ['NH-13 Inner Pass'],
      reason: 'Moderate safety buffer with acceptable travel time.',
      polyline_coords: safestPolyline,
    };

    return {
      recommended_route_id: safestOption.route_id,
      options: [safestOption, fastestOption, balancedOption],
      has_active_hazards: hasHighRiskNH13 || activeIncidents.length > 0,
    };
  }
}

export const routingService = new RoutingService();
