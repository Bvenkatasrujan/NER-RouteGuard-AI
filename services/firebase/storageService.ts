import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

class StorageService {
  async uploadIncidentPhoto(incidentId: string, photoUri: string): Promise<string> {
    if (!photoUri) return '';

    try {
      // If photoUri is already a web URL, return it
      if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
        return photoUri;
      }

      const filename = `photo_${Date.now()}.jpg`;
      const storageRef = ref(storage, `incident_reports/${incidentId}/${filename}`);

      // Fetch blob from URI
      const response = await fetch(photoUri);
      const blob = await response.blob();

      // Upload binary to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage upload warning (using fallback URI):', error);
      return photoUri;
    }
  }
}

export const storageService = new StorageService();
