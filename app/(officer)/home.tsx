import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../store/authStore';
import { firestoreService } from '../../services/firebase/firestoreService';
import { WeatherCondition, IncidentSeverity, IncidentReportDoc } from '../../types/incident';
import { AIAnalysisDoc } from '../../types/routing';
import { AppHeader } from '../../components/ui/AppHeader';
import { ProfileModal } from '../../components/ui/ProfileModal';
import { AIResultCard } from '../../components/ui/AIResultCard';
import { SeveritySelector, SeverityLevel } from '../../components/ui/SeveritySelector';
import { SelectorChip, SelectorChipOption } from '../../components/ui/SelectorChip';
import { EmptyState } from '../../components/ui/EmptyState';

const WEATHER_OPTIONS: SelectorChipOption[] = [
  { id: 'CLEAR', label: '☀️ Clear' },
  { id: 'CLOUDY', label: '☁️ Cloudy' },
  { id: 'RAIN', label: '🌧️ Rain' },
  { id: 'HEAVY_RAIN', label: '⛈️ Heavy Rain' },
  { id: 'STORM', label: '🌩️ Storm' },
  { id: 'FOG', label: '🌫️ Fog' },
  { id: 'SNOW', label: '❄️ Snow' },
  { id: 'OTHER', label: '⚠️ Other' },
];

export default function OfficerHomeScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  const officerUid = user?.uid || user?.id || '';
  const officerName = user?.name || 'Field Officer';

  // Strict Field Officer Form States
  const [weather, setWeather] = useState<WeatherCondition>('CLEAR');
  const [hazardDescription, setHazardDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [latitude, setLatitude] = useState('27.2644');
  const [longitude, setLongitude] = useState('92.4159');

  // Async & Subscription States
  const [submitting, setSubmitting] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [submittedReports, setSubmittedReports] = useState<IncidentReportDoc[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisDoc | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!officerUid) return;

    const unsubIncidents = firestoreService.listenToOfficerIncidents(officerUid, (reports) => {
      setSubmittedReports(reports);
    });

    const unsubAI = firestoreService.listenToAIAnalysis((analysis) => {
      setAiAnalysis(analysis);
    });

    return () => {
      unsubIncidents();
      unsubAI();
    };
  }, [officerUid]);

  const handleDetectGps = async () => {
    setDetectingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'GPS permission denied. Please enter coordinates manually.');
        setDetectingGps(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toFixed(6));
      setLongitude(loc.coords.longitude.toFixed(6));
      Alert.alert('GPS Location Populated', 'Coordinates updated using current device position.');
    } catch (e) {
      Alert.alert('GPS Error', 'Could not detect device GPS. Enter coordinates manually.');
    } finally {
      setDetectingGps(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!hazardDescription.trim()) {
      Alert.alert('Required Field', 'Please enter a Hazard Description.');
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      Alert.alert('Invalid Latitude', 'Latitude must be between -90 and 90.');
      return;
    }

    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      Alert.alert('Invalid Longitude', 'Longitude must be between -180 and 180.');
      return;
    }

    const reportSeverity: IncidentSeverity = severity === 'CRITICAL' ? 'HIGH' : (severity as IncidentSeverity);

    setSubmitting(true);
    try {
      const res = await firestoreService.submitIncidentReport({
        officerId: officerUid,
        weather,
        hazardDescription: hazardDescription.trim(),
        severity: reportSeverity,
        latitude: latNum,
        longitude: lngNum,
      });

      setSuccessMessage(`Incident Report submitted to AI Engine. Report ID: #${res.reportId}`);
      setHazardDescription('');
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Failed to submit incident report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Universal Government Header */}
      <AppHeader
        subtitle="Field Officer Intelligence Dispatch"
        onAvatarPress={() => setShowProfileModal(true)}
        userName={officerName}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Alert Banner */}
        {successMessage && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#047857" />
            <Text style={styles.successBannerText}>{successMessage}</Text>
            <TouchableOpacity onPress={() => setSuccessMessage(null)}>
              <Ionicons name="close" size={16} color="#047857" />
            </TouchableOpacity>
          </View>
        )}

        {/* Section 1: Field Officer Report Form */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="document-text" size={16} color="#2563EB" />
          <Text style={styles.sectionTitle}>1. SUBMIT FIELD INCIDENT REPORT</Text>
        </View>

        <View style={styles.formCard}>
          {/* 1. Weather Selection */}
          <SelectorChip
            label="1. WEATHER CONDITION"
            options={WEATHER_OPTIONS}
            selectedId={weather}
            onSelect={(id) => setWeather(id as WeatherCondition)}
          />

          {/* 2. Severity Selection */}
          <SeveritySelector
            selected={severity}
            onSelect={setSeverity}
            disabled={submitting}
          />

          {/* 3. Coordinates Box (GPS Latitude & Longitude) */}
          <View style={styles.coordsBox}>
            <View style={styles.coordsHeader}>
              <View style={styles.coordsHeaderLeft}>
                <Ionicons name="location" size={14} color="#2563EB" />
                <Text style={styles.coordsTitle}>GPS COORDINATES</Text>
              </View>
              <TouchableOpacity style={styles.gpsBtn} onPress={handleDetectGps} disabled={detectingGps}>
                {detectingGps ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <>
                    <Ionicons name="locate" size={13} color="#2563EB" />
                    <Text style={styles.gpsBtnText}>Auto Device GPS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>LATITUDE (-90 to 90)</Text>
                <TextInput
                  style={styles.textInput}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="27.2644"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>LONGITUDE (-180 to 180)</Text>
                <TextInput
                  style={styles.textInput}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="92.4159"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* 4. Hazard Description */}
          <View style={styles.fieldCol}>
            <Text style={styles.fieldLabel}>4. HAZARD DESCRIPTION</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={hazardDescription}
              onChangeText={setHazardDescription}
              placeholder="Describe road condition, landslide debris, mudflow volume, or flash flood impact..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Submit Action Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReport}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>SUBMIT TO AI ENGINE ➔</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Section 2: AI Risk Prediction Result */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="hardware-chip" size={16} color="#2563EB" />
          <Text style={styles.sectionTitle}>2. AI ENGINE RISK PREDICTION</Text>
        </View>

        <AIResultCard
          riskScore={aiAnalysis?.riskScore || 85}
          hazardType={aiAnalysis?.hazard || 'LANDSLIDE & CORRIDOR DISRUPTION'}
          disruptionProb={aiAnalysis?.disruptionProbability ? Math.round(aiAnalysis.disruptionProbability * 100) : 88}
          affectedRoad={aiAnalysis?.affectedRoad || 'NH-13 Bomdila Stretch'}
          recommendedAction={`AI Model (${aiAnalysis?.modelName || 'NER-RouteGuard AI'} ${aiAnalysis?.modelVersion || 'v2.4'}): Automated GeoJSON route calculation triggered.`}
          status={aiAnalysis?.analysisStatus || 'COMPLETED'}
        />

        {/* Section 3: Submitted Incident Reports History */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="list" size={16} color="#64748B" />
          <Text style={styles.sectionTitle}>3. MY INCIDENT REPORTS ({submittedReports.length})</Text>
        </View>

        {submittedReports.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="NO REPORTS SUBMITTED"
            message="Submitted field incident reports will automatically stream from Firestore."
          />
        ) : (
          <View style={{ gap: 10 }}>
            {submittedReports.map((item) => (
              <View key={item.reportId} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyId}>#{item.reportId}</Text>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyStatus}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.historyDesc}>{item.hazardDescription}</Text>
                <View style={styles.historyFooter}>
                  <Text style={styles.historyMeta}>Weather: {item.weather} • Lat/Lng: {item.latitude}, {item.longitude}</Text>
                  <Text style={styles.historySeverity}>Severity: {item.severity}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* User Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSignOut={async () => {
          setShowProfileModal(false);
          await logout();
          router.replace('/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  successBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldCol: {
    flex: 1,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  coordsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  coordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coordsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  gpsBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  historyStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  historyDesc: {
    fontSize: 12,
    color: '#475569',
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  historyMeta: {
    fontSize: 10,
    color: '#64748B',
  },
  historySeverity: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
});
