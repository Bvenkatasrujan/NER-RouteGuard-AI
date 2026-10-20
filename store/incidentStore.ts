import React, { createContext, useContext, useState, useEffect } from 'react';
import { IncidentReport } from '../types/incident';
import { incidentService } from '../services/api/incidentService';

interface IncidentContextType {
  incidents: IncidentReport[];
  pendingOfflineCount: number;
  submitIncident: (report: IncidentReport, isOnline?: boolean) => Promise<{ success: boolean; isOfflineSaved: boolean; incident: IncidentReport }>;
  addIncident: (report: IncidentReport, isOnline?: boolean) => Promise<{ success: boolean; isOfflineSaved: boolean; incident: IncidentReport }>;
  syncOfflineQueue: () => Promise<number>;
  reloadIncidents: () => Promise<void>;
  triggerDemoScenario: () => Promise<IncidentReport>;
}

const IncidentContext = createContext<IncidentContextType>({
  incidents: [],
  pendingOfflineCount: 0,
  submitIncident: async () => ({ success: false, isOfflineSaved: false, incident: {} as IncidentReport }),
  addIncident: async () => ({ success: false, isOfflineSaved: false, incident: {} as IncidentReport }),
  syncOfflineQueue: async () => 0,
  reloadIncidents: async () => {},
  triggerDemoScenario: async () => ({} as IncidentReport),
});



export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(0);

  const reloadIncidents = async () => {
    const list = await incidentService.getIncidents();
    setIncidents([...list]);
  };

  useEffect(() => {
    reloadIncidents();
  }, []);

  const submitIncident = async (report: IncidentReport, isOnline: boolean = true) => {
    const res = await incidentService.submitIncident(report, isOnline);
    if (res.isOfflineSaved) {
      setPendingOfflineCount((prev) => prev + 1);
    }
    await reloadIncidents();

    // Re-sync after backend AI processing simulation completes (1.3s)
    if (isOnline) {
      setTimeout(async () => {
        await reloadIncidents();
      }, 1400);
    }
    return res;
  };


  const syncOfflineQueue = async () => {
    const syncedCount = await incidentService.syncOfflineReports();
    if (syncedCount > 0) {
      setPendingOfflineCount(0);
      await reloadIncidents();
    }
    return syncedCount;
  };

  const triggerDemoScenario = async (): Promise<IncidentReport> => {
    const demoLandslide: IncidentReport = {
      incident_id: 'INC-2026-DEMO-' + Math.floor(100 + Math.random() * 900),
      reported_by: 'FO-001',
      reporter_name: 'Officer Sharma',
      reporter_role: 'FIELD_OFFICER',
      incident_type: 'LANDSLIDE',
      severity: 'HIGH',
      latitude: 27.2644,
      longitude: 92.4159,
      location_name: 'NH-13 Bomdila Pass Corridor',
      state: 'Arunachal Pradesh',
      district: 'West Kameng',
      nearest_road: 'NH-13',
      road_status: 'PARTIALLY_BLOCKED',
      affected_length_m: 250,
      description: 'Major landslide blocking primary eastbound lane on NH-13. Boulders and mud deposit.',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    await submitIncident(demoLandslide, true);
    return demoLandslide;
  };

  return React.createElement(
    IncidentContext.Provider,
    {
      value: {
        incidents,
        pendingOfflineCount,
        submitIncident,
        addIncident: submitIncident,
        syncOfflineQueue,
        reloadIncidents,
        triggerDemoScenario,
      },
    },
    children
  );
};

export const useIncidents = () => useContext(IncidentContext);
