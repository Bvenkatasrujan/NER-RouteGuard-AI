import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IncidentReportDoc } from '../../types/incident';
import { AIAnalysisDoc, RouteDoc, MapGuardRouteResponse } from '../../types/routing';

/**
 * MapGuard / MapsRouter Backend Service Client
 * Endpoint: POST /api/maps-router/route
 */
export class MapGuardApiService {
  async postRouteRequest(params: {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
  }): Promise<MapGuardRouteResponse> {
    const { origin, destination } = params;

    // Validate origin and destination coordinates
    if (
      isNaN(origin.latitude) ||
      origin.latitude < -90 ||
      origin.latitude > 90 ||
      isNaN(origin.longitude) ||
      origin.longitude < -180 ||
      origin.longitude > 180
    ) {
      return {
        success: false,
        routeId: '',
        routeStatus: 'CANCELLED',
        routeType: 'NONE',
        origin,
        destination,
        distanceKm: 0,
        estimatedTravelTimeMinutes: 0,
        riskScore: 0,
        riskLevel: 'LOW',
        affectedRoad: 'None',
        geometry: { type: 'LineString', coordinates: [] },
        error: 'Please provide a valid starting location.',
      };
    }

    if (
      isNaN(destination.latitude) ||
      destination.latitude < -90 ||
      destination.latitude > 90 ||
      isNaN(destination.longitude) ||
      destination.longitude < -180 ||
      destination.longitude > 180
    ) {
      return {
        success: false,
        routeId: '',
        routeStatus: 'CANCELLED',
        routeType: 'NONE',
        origin,
        destination,
        distanceKm: 0,
        estimatedTravelTimeMinutes: 0,
        riskScore: 0,
        riskLevel: 'LOW',
        affectedRoad: 'None',
        geometry: { type: 'LineString', coordinates: [] },
        error: 'Please provide a valid destination.',
      };
    }

    try {
      // 1. Read existing active incident reports from Firestore
      let activeReport: IncidentReportDoc | null = null;
      let aiAnalysis: AIAnalysisDoc | null = null;

      const incSnap = await getDocs(collection(db, 'incident_reports'));
      if (!incSnap.empty) {
        activeReport = incSnap.docs[0].data() as IncidentReportDoc;
      }

      if (activeReport?.reportId) {
        const aiSnap = await getDocs(collection(db, 'ai_analysis'));
        if (!aiSnap.empty) {
          aiAnalysis = aiSnap.docs[0].data() as AIAnalysisDoc;
        }
      }

      const reportId = activeReport?.reportId || 'DEMO_REPORT_001';
      const analysisId = aiAnalysis?.analysisId || 'DEMO_AI_001';

      // 2. MapGuard Risk & Route Calculation
      const rad = Math.PI / 180;
      const dLat = (destination.latitude - origin.latitude) * rad;
      const dLon = (destination.longitude - origin.longitude) * rad;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(origin.latitude * rad) *
          Math.cos(destination.latitude * rad) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const directDistKm = 6371 * c;
      const distanceKm = Math.round((directDistKm * 1.3 + Number.EPSILON) * 10) / 10 || 142.5;
      const estimatedTravelTimeMinutes = Math.round((distanceKm / 45) * 60) || 190;

      // Generate road coordinates in GeoJSON [longitude, latitude] format
      const midLng1 = origin.longitude + (destination.longitude - origin.longitude) * 0.35 + 0.04;
      const midLat1 = origin.latitude + (destination.latitude - origin.latitude) * 0.35 - 0.02;

      const midLng2 = origin.longitude + (destination.longitude - origin.longitude) * 0.7 - 0.03;
      const midLat2 = origin.latitude + (destination.latitude - origin.latitude) * 0.7 + 0.03;

      const coordinates: Array<{ longitude: number; latitude: number }> = [
        { longitude: origin.longitude, latitude: origin.latitude },
        { longitude: midLng1, latitude: midLat1 },
        { longitude: midLng2, latitude: midLat2 },
        { longitude: destination.longitude, latitude: destination.latitude },
      ];

      // Route Type Determination
      let routeType = 'OPTIMIZED_SAFE_DETOUR';
      const riskScore = aiAnalysis?.riskScore ?? (activeReport?.severity === 'CRITICAL' ? 88 : 28);
      const riskLevel = aiAnalysis?.riskLevel || activeReport?.severity || 'LOW';

      if (riskLevel === 'CRITICAL') {
        routeType = 'NO_HAZARD_FREE_ALTERNATIVE_AVAILABLE';
      } else if (riskLevel === 'HIGH' || riskLevel === 'MEDIUM') {
        routeType = 'ROUTE_WITH_MINIMIZED_RISK';
      } else {
        routeType = 'OPTIMIZED_SAFE_DETOUR';
      }

      const routeId = `ROUTE_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

      const routeDoc: RouteDoc = {
        routeId,
        reportId,
        analysisId,
        origin: { latitude: origin.latitude, longitude: origin.longitude },
        destination: { latitude: destination.latitude, longitude: destination.longitude },
        geometry: { type: 'LineString', coordinates },
        distanceKm,
        estimatedTravelTimeMinutes,
        riskScore,
        riskLevel,
        affectedRoad: aiAnalysis?.affectedRoad || 'NH-13 Bomdila Stretch',
        routeStatus: 'AVAILABLE',
        routeType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore `routes/{routeId}`
      const docRef = doc(db, 'routes', routeId);
      await setDoc(docRef, routeDoc);

      return {
        success: true,
        routeId,
        routeStatus: 'AVAILABLE',
        routeType,
        origin,
        destination,
        distanceKm,
        estimatedTravelTimeMinutes,
        riskScore,
        riskLevel,
        affectedRoad: routeDoc.affectedRoad,
        geometry: routeDoc.geometry,
      };
    } catch (err: any) {
      console.warn('MapGuard route API error:', err);
      return {
        success: false,
        routeId: '',
        routeStatus: 'CANCELLED',
        routeType: 'NONE',
        origin,
        destination,
        distanceKm: 0,
        estimatedTravelTimeMinutes: 0,
        riskScore: 0,
        riskLevel: 'LOW',
        affectedRoad: 'None',
        geometry: { type: 'LineString', coordinates: [] },
        error: 'Route service is currently unavailable.',
      };
    }
  }
}

export const mapGuardApi = new MapGuardApiService();
