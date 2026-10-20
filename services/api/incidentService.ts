import { IncidentReport } from '../../types/incident';
import { INITIAL_SEED_INCIDENTS } from '../mockData/demoIncidents';
import { enqueueOfflineReport, getOfflineQueue, clearOfflineQueue } from '../../utils/offlineQueue';

class IncidentService {
  private incidents: IncidentReport[] = [...INITIAL_SEED_INCIDENTS];

  async getIncidents(): Promise<IncidentReport[]> {
    return this.incidents;
  }

  // Private helper simulating independent server-side AI Engine analysis pipeline
  private processAIEngineAnalysis(report: IncidentReport) {
    // Initial state set on Firestore write: AI Engine receives document
    report.ai_analysis = {
      hazard: report.incident_type,
      risk_score: report.severity === 'CRITICAL' ? 0.95 : report.severity === 'HIGH' ? 0.85 : report.severity === 'MEDIUM' ? 0.60 : 0.35,
      risk_level: report.severity,
      disruption_probability: report.severity === 'CRITICAL' ? 0.98 : report.severity === 'HIGH' ? 0.88 : report.severity === 'MEDIUM' ? 0.55 : 0.25,
      nearest_road: report.nearest_road || 'NH-13',
      recommended_action: report.severity === 'HIGH' || report.severity === 'CRITICAL'
        ? 'ACTIVATE_ALTERNATIVE_BYPASS_REROUTE'
        : 'PROCEED_WITH_CAUTION_MONITOR_CORRIDOR',
      status: 'PROCESSING',
    };

    // Simulate backend async processing completion after 1.2s
    setTimeout(() => {
      if (report.ai_analysis) {
        report.ai_analysis.status = 'COMPLETED';
        report.ai_analysis.processed_at = new Date().toISOString();
      }
    }, 1200);
  }

  async submitIncident(report: IncidentReport, isOnline: boolean = true): Promise<{ success: boolean; isOfflineSaved: boolean; incident: IncidentReport }> {
    if (!isOnline) {
      enqueueOfflineReport(report);
      return { success: true, isOfflineSaved: true, incident: report };
    }

    report.status = 'ACTIVE';
    this.processAIEngineAnalysis(report);
    this.incidents.unshift(report);
    return { success: true, isOfflineSaved: false, incident: report };
  }

  async syncOfflineReports(): Promise<number> {
    const queue = getOfflineQueue();
    if (queue.length === 0) return 0;

    let count = 0;
    for (const report of queue) {
      report.status = 'ACTIVE';
      this.processAIEngineAnalysis(report);
      this.incidents.unshift(report);
      count++;
    }
    clearOfflineQueue();
    return count;
  }
}

export const incidentService = new IncidentService();

