import AsyncStorage from '@react-native-async-storage/async-storage';
import { IncidentReport } from '../types/incident';
import { firestoreService } from '../services/firebase/firestoreService';

const QUEUE_KEY = '@routeguard_offline_incident_queue';

let inMemoryQueue: IncidentReport[] = [];

export class OfflineQueueService {
  async getQueue(): Promise<IncidentReport[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : inMemoryQueue;
    } catch (e) {
      return inMemoryQueue;
    }
  }

  async enqueueReport(report: IncidentReport): Promise<void> {
    report.status = 'PENDING_SYNC';
    inMemoryQueue.push(report);
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(inMemoryQueue));
    } catch (e) {
      // Memory fallback
    }
  }

  async syncPendingReports(): Promise<number> {
    const queue = await this.getQueue();
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    const remaining: IncidentReport[] = [];

    for (const report of queue) {
      try {
        await firestoreService.submitIncidentReport({
          officerId: report.officerId || 'FO_DEFAULT',
          weather: report.weather || 'CLEAR',
          hazardDescription: report.hazardDescription || 'Offline Report',
          severity: report.severity || 'HIGH',
          latitude: report.latitude || 27.2644,
          longitude: report.longitude || 92.4159,
        });
        syncedCount++;
      } catch (e) {
        remaining.push(report);
      }
    }

    inMemoryQueue = remaining;
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    return syncedCount;
  }
}

export const offlineQueue = new OfflineQueueService();

export function enqueueOfflineReport(report: IncidentReport) {
  offlineQueue.enqueueReport(report);
}

export function getOfflineQueue(): IncidentReport[] {
  return inMemoryQueue;
}

export function clearOfflineQueue() {
  inMemoryQueue = [];
  AsyncStorage.removeItem(QUEUE_KEY);
}
