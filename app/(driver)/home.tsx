import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useAuth } from '../../store/authStore';
import { firestoreService } from '../../services/firebase/firestoreService';
import { mapGuardApi } from '../../services/api/mapGuardApi';
import { AIAnalysisDoc, RouteDoc } from '../../types/routing';
import { IncidentReportDoc } from '../../types/incident';

import { AppHeader } from '../../components/ui/AppHeader';
import { ProfileModal } from '../../components/ui/ProfileModal';
import { MapViewOSM } from '../../components/MapViewOSM';

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  const driverUid = user?.uid || user?.id || '';
  const driverName = user?.name || 'Logistics Driver';

  // 1. Driver Route Request Coordinates state
  const [startLat, setStartLat] = useState<string>('27.12345');
  const [startLng, setStartLng] = useState<string>('93.45678');
  const [destLat, setDestLat] = useState<string>('27.50000');
  const [destLng, setDestLng] = useState<string>('93.80000');

  // Loading, Waiting & Data States
  const [locating, setLocating] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [waitingStepText, setWaitingStepText] = useState<string>('');

  const [savedRouteId, setSavedRouteId] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteDoc | null>(null);
  const [routeErrorMsg, setRouteErrorMsg] = useState<string | null>(null);

  const [activeIncidents, setActiveIncidents] = useState<IncidentReportDoc[]>([]);
  const [aiAnalysesMap, setAiAnalysesMap] = useState<Record<string, AIAnalysisDoc>>({});
  const [selectedIncidentReport, setSelectedIncidentReport] = useState<IncidentReportDoc | null>(null);
  const [selectedAIAnalysis, setSelectedAIAnalysis] = useState<AIAnalysisDoc | null>(null);
  const [selectedHazardId, setSelectedHazardId] = useState<string | null>(null);

  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // 2. Real-time Firebase listeners for active incidents and AI analyses
  useEffect(() => {
    if (!driverUid) return;

    // Stream active incident reports from Firestore `incident_reports`
    const unsubIncidents = firestoreService.listenToAllActiveIncidents((incidents) => {
      setActiveIncidents(incidents);
      if (incidents.length > 0 && !selectedIncidentReport) {
        setSelectedIncidentReport(incidents[0]);
      }
    });

    // Stream AI analyses from Firestore `ai_analysis`
    const unsubAI = firestoreService.listenToAllAIAnalyses((map) => {
      setAiAnalysesMap(map);
    });

    return () => {
      unsubIncidents();
      unsubAI();
    };
  }, [driverUid]);

  // 3. Listen to exact Firestore document routes/{routeId} when savedRouteId is set by MapGuard
  useEffect(() => {
    if (!savedRouteId) return;

    const unsubRoute = firestoreService.listenToRouteById(savedRouteId, (doc) => {
      if (doc) {
        setActiveRoute(doc);
        setRouteErrorMsg(null);
      } else {
        setRouteErrorMsg('Route was generated but could not be loaded.');
      }
    });

    return () => unsubRoute();
  }, [savedRouteId]);

  // Update selected Field Officer Report and AI Analysis when activeRoute updates
  useEffect(() => {
    if (activeRoute?.reportId) {
      firestoreService.getIncidentReportById(activeRoute.reportId).then((rep) => {
        if (rep) setSelectedIncidentReport(rep);
      });
      firestoreService.getAIAnalysisByReportId(activeRoute.reportId).then((ai) => {
        if (ai) setSelectedAIAnalysis(ai);
      });
    }
  }, [activeRoute?.reportId]);

  // Telemetry GPS Writer while in IN_PROGRESS
  useEffect(() => {
    if (activeRoute?.routeStatus === 'IN_PROGRESS' && driverUid) {
      const gpsInterval = setInterval(() => {
        const sLat = parseFloat(startLat) || 27.12345;
        const sLng = parseFloat(startLng) || 93.45678;
        firestoreService.recordDriverTracking({
          routeId: activeRoute.routeId,
          driverId: driverUid,
          latitude: sLat + (Math.random() * 0.004 - 0.002),
          longitude: sLng + (Math.random() * 0.004 - 0.002),
          speed: 48,
          heading: 120,
        });
      }, 15000);

      return () => clearInterval(gpsInterval);
    }
  }, [activeRoute?.routeStatus, activeRoute?.routeId, driverUid, startLat, startLng]);

  // Handle "USE CURRENT LOCATION" button
  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions to automatically detect starting coordinates.');
        setLocating(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setStartLat(position.coords.latitude.toFixed(5));
      setStartLng(position.coords.longitude.toFixed(5));
    } catch (e: any) {
      Alert.alert('Location Error', e.message || 'Failed to detect current location.');
    } finally {
      setLocating(false);
    }
  };

  // Handle "FIND OPTIMAL ROUTE" button
  const handleFindOptimalRoute = async () => {
    const sLat = parseFloat(startLat);
    const sLng = parseFloat(startLng);
    const dLat = parseFloat(destLat);
    const dLng = parseFloat(destLng);

    // Validation
    if (isNaN(sLat) || sLat < -90 || sLat > 90) {
      Alert.alert('Invalid Origin', 'Please provide a valid starting location latitude between -90 and 90.');
      return;
    }
    if (isNaN(sLng) || sLng < -180 || sLng > 180) {
      Alert.alert('Invalid Origin', 'Please provide a valid starting location longitude between -180 and 180.');
      return;
    }
    if (isNaN(dLat) || dLat < -90 || dLat > 90) {
      Alert.alert('Invalid Destination', 'Please provide a valid destination latitude between -90 and 90.');
      return;
    }
    if (isNaN(dLng) || dLng < -180 || dLng > 180) {
      Alert.alert('Invalid Destination', 'Please provide a valid destination longitude between -180 and 180.');
      return;
    }

    setCalculating(true);
    setRouteErrorMsg(null);
    setWaitingStepText('ANALYZING ROUTE...');

    // Progress Waiting State updates
    const t1 = setTimeout(() => {
      setWaitingStepText('CHECKING REPORTED HAZARDS...');
    }, 600);

    const t2 = setTimeout(() => {
      setWaitingStepText('CALCULATING OPTIMAL ROUTE...');
    }, 1200);

    try {
      const response = await mapGuardApi.postRouteRequest({
        origin: { latitude: sLat, longitude: sLng },
        destination: { latitude: dLat, longitude: dLng },
      });

      if (!response.success || !response.routeId) {
        setRouteErrorMsg(response.error || 'NO VALID ROUTE FOUND');
        setActiveRoute(null);
        setSavedRouteId(null);
      } else {
        // Store routeId in Driver screen state and read routes/{routeId} from Firestore
        setSavedRouteId(response.routeId);
        const fetchedDoc = await firestoreService.getRouteById(response.routeId);
        if (fetchedDoc) {
          setActiveRoute(fetchedDoc);
        } else {
          setRouteErrorMsg('Route was generated but could not be loaded.');
        }
      }
    } catch (err: any) {
      setRouteErrorMsg(err.message || 'Route service is currently unavailable.');
      setActiveRoute(null);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setCalculating(false);
      setWaitingStepText('');
    }
  };

  // Handle Route Status Changes
  const handleStartRoute = async () => {
    if (activeRoute) {
      await firestoreService.updateRouteStatus(activeRoute.routeId, 'IN_PROGRESS');
      setActiveRoute({ ...activeRoute, routeStatus: 'IN_PROGRESS' });
    }
  };

  const handleCompleteRoute = async () => {
    if (activeRoute) {
      await firestoreService.updateRouteStatus(activeRoute.routeId, 'COMPLETED');
      setActiveRoute({ ...activeRoute, routeStatus: 'COMPLETED' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Universal Header */}
      <AppHeader
        subtitle="Driver Logistics & Route Optimization"
        onAvatarPress={() => setShowProfileModal(true)}
        userName={driverName}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Banner */}
        <View style={styles.headerTitleCard}>
          <Text style={styles.titleBadge}>ROUTEGUARD NAVIGATION</Text>
          <Text style={styles.titleSub}>Enter your starting point and destination to find the safest available route.</Text>
        </View>

        {/* 1. Driver Input Form */}
        <View style={styles.inputCard}>
          <Text style={styles.inputSectionHeader}>STARTING LOCATION</Text>
          <View style={styles.coordRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Latitude:</Text>
              <TextInput
                style={styles.textInput}
                value={startLat}
                onChangeText={setStartLat}
                placeholder="27.12345"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Longitude:</Text>
              <TextInput
                style={styles.textInput}
                value={startLng}
                onChangeText={setStartLng}
                placeholder="93.45678"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.useLocationBtn}
            onPress={handleUseCurrentLocation}
            disabled={locating || calculating}
            activeOpacity={0.8}
          >
            {locating ? (
              <ActivityIndicator color="#1D4ED8" size="small" />
            ) : (
              <>
                <Ionicons name="location" size={16} color="#1D4ED8" />
                <Text style={styles.useLocationBtnText}>USE CURRENT LOCATION</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.inputSectionHeader, { marginTop: 16 }]}>DESTINATION</Text>
          <View style={styles.coordRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Latitude:</Text>
              <TextInput
                style={styles.textInput}
                value={destLat}
                onChangeText={setDestLat}
                placeholder="27.50000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Longitude:</Text>
              <TextInput
                style={styles.textInput}
                value={destLng}
                onChangeText={setDestLng}
                placeholder="93.80000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.findRouteBtn}
            onPress={handleFindOptimalRoute}
            disabled={calculating}
            activeOpacity={0.85}
          >
            {calculating ? (
              <View style={styles.waitingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.waitingStepText}>{waitingStepText || 'ANALYZING ROUTE...'}</Text>
              </View>
            ) : (
              <>
                <Ionicons name="navigate-circle" size={20} color="#FFFFFF" />
                <Text style={styles.findRouteBtnText}>FIND OPTIMAL ROUTE</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 2. Route Error or Warning Banners */}
        {routeErrorMsg && (
          <View style={styles.errorCard}>
            <Ionicons name="warning" size={20} color="#DC2626" />
            <Text style={styles.errorCardText}>{routeErrorMsg}</Text>
          </View>
        )}

        {activeRoute?.routeType === 'NO_HAZARD_FREE_ALTERNATIVE_AVAILABLE' && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle" size={20} color="#EA580C" />
            <Text style={styles.warningBannerText}>⚠️ NO HAZARD-FREE ALTERNATIVE AVAILABLE</Text>
          </View>
        )}

        {/* 3. OpenStreetMap Visual Map Rendering */}
        <View style={styles.mapHeaderRow}>
          <Ionicons name="map" size={16} color="#2563EB" />
          <Text style={styles.mapHeaderTitle}>OPENSTREETMAP ROUTE & HAZARDS</Text>
        </View>

        <MapViewOSM
          route={activeRoute}
          origin={{ latitude: parseFloat(startLat) || 27.12345, longitude: parseFloat(startLng) || 93.45678 }}
          destination={{ latitude: parseFloat(destLat) || 27.50000, longitude: parseFloat(destLng) || 93.80000 }}
          incidents={activeIncidents}
          aiAnalyses={aiAnalysesMap}
          selectedHazardId={selectedHazardId}
          height={320}
        />

        {/* 4. Route Information Panel */}
        {activeRoute && activeRoute.routeStatus !== 'CANCELLED' ? (
          <View style={styles.routeInfoCard}>
            <View style={styles.routeInfoHeader}>
              <Text style={styles.routeInfoTitle}>OPTIMIZED ROUTE</Text>
              <View style={[styles.statusTag, activeRoute.routeStatus === 'COMPLETED' ? styles.statusTagCompleted : styles.statusTagActive]}>
                <Text style={styles.statusTagText}>{activeRoute.routeStatus}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoGridItem}>
                <Text style={styles.gridItemLabel}>Distance</Text>
                <Text style={styles.gridItemValue}>{activeRoute.distanceKm} km</Text>
              </View>
              <View style={styles.infoGridItem}>
                <Text style={styles.gridItemLabel}>Travel Time</Text>
                <Text style={styles.gridItemValue}>{activeRoute.estimatedTravelTimeMinutes} min</Text>
              </View>
              <View style={styles.infoGridItem}>
                <Text style={styles.gridItemLabel}>Risk Score</Text>
                <Text style={[styles.gridItemValue, { color: activeRoute.riskScore > 70 ? '#DC2626' : '#10B981' }]}>
                  {activeRoute.riskScore} / 100
                </Text>
              </View>
            </View>

            <View style={styles.infoDetailRow}>
              <Text style={styles.infoDetailLabel}>Risk Level:</Text>
              <Text style={[styles.infoDetailValue, { color: activeRoute.riskLevel === 'CRITICAL' ? '#DC2626' : '#0F172A', fontWeight: '800' }]}>
                {activeRoute.riskLevel}
              </Text>
            </View>

            <View style={styles.infoDetailRow}>
              <Text style={styles.infoDetailLabel}>Affected Road:</Text>
              <Text style={styles.infoDetailValue}>{activeRoute.affectedRoad}</Text>
            </View>

            <View style={styles.infoDetailRow}>
              <Text style={styles.infoDetailLabel}>Route Type:</Text>
              <Text style={[styles.infoDetailValue, { fontWeight: '700', color: '#2563EB' }]}>
                {activeRoute.routeType || 'OPTIMIZED_SAFE_DETOUR'}
              </Text>
            </View>

            {/* Route Status Controls */}
            {activeRoute.routeStatus === 'AVAILABLE' || activeRoute.routeStatus === 'ASSIGNED' ? (
              <TouchableOpacity style={styles.transitBtn} onPress={handleStartRoute} activeOpacity={0.85}>
                <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                <Text style={styles.transitBtnText}>START TRANSIT (SET IN_PROGRESS)</Text>
              </TouchableOpacity>
            ) : activeRoute.routeStatus === 'IN_PROGRESS' ? (
              <TouchableOpacity style={[styles.transitBtn, styles.completeBtn]} onPress={handleCompleteRoute} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.transitBtnText}>MARK ROUTE COMPLETED</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedBox}>
                <Ionicons name="checkmark-done-circle" size={18} color="#047857" />
                <Text style={styles.completedBoxText}>ROUTE TRANSIT COMPLETED</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noRouteCard}>
            <Ionicons name="information-circle-outline" size={24} color="#64748B" />
            <Text style={styles.noRouteText}>NO VALID ROUTE FOUND</Text>
          </View>
        )}

        {/* 5. Read-Only Field Officer Report */}
        {selectedIncidentReport ? (
          <View style={styles.reportSheetCard}>
            <View style={styles.sheetTitleRow}>
              <Ionicons name="document-text-outline" size={18} color="#1D4ED8" />
              <Text style={styles.sheetTitleText}>FIELD OFFICER REPORT</Text>
            </View>
            <View style={styles.sheetBody}>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Report ID:</Text>
                <Text style={styles.sheetVal}>{selectedIncidentReport.reportId}</Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Weather:</Text>
                <Text style={styles.sheetVal}>{selectedIncidentReport.weather}</Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Hazard Description:</Text>
                <Text style={[styles.sheetVal, { fontWeight: '700' }]}>{selectedIncidentReport.hazardDescription}</Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Severity:</Text>
                <Text style={[styles.sheetVal, { color: selectedIncidentReport.severity === 'CRITICAL' ? '#DC2626' : '#EA580C', fontWeight: '800' }]}>
                  {selectedIncidentReport.severity}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Latitude:</Text>
                <Text style={styles.sheetVal}>
                  {selectedIncidentReport.latitude != null && !isNaN(Number(selectedIncidentReport.latitude))
                    ? Number(selectedIncidentReport.latitude).toFixed(5)
                    : '27.12345'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Longitude:</Text>
                <Text style={styles.sheetVal}>
                  {selectedIncidentReport.longitude != null && !isNaN(Number(selectedIncidentReport.longitude))
                    ? Number(selectedIncidentReport.longitude).toFixed(5)
                    : '93.45678'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Reported Time:</Text>
                <Text style={styles.sheetVal}>18 Sep 2026, 10:30 AM</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* 6. Read-Only AI Risk Analysis Sheet */}
        {selectedAIAnalysis || activeRoute ? (
          <View style={[styles.reportSheetCard, styles.aiCard]}>
            <View style={styles.sheetTitleRow}>
              <Ionicons name="hardware-chip-outline" size={18} color="#7C3AED" />
              <Text style={[styles.sheetTitleText, { color: '#7C3AED' }]}>AI RISK ANALYSIS</Text>
            </View>
            <View style={styles.sheetBody}>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Hazard:</Text>
                <Text style={[styles.sheetVal, { fontWeight: '800' }]}>
                  {selectedAIAnalysis?.hazard || activeRoute?.affectedRoad || 'LANDSLIDE & CORRIDOR DISRUPTION'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Risk Score:</Text>
                <Text style={[styles.sheetVal, { color: '#DC2626', fontWeight: '800' }]}>
                  {selectedAIAnalysis?.riskScore ?? activeRoute?.riskScore ?? 86} / 100
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Risk Level:</Text>
                <Text style={[styles.sheetVal, { color: '#DC2626', fontWeight: '800' }]}>
                  {selectedAIAnalysis?.riskLevel || activeRoute?.riskLevel || 'CRITICAL'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Disruption Probability:</Text>
                <Text style={styles.sheetVal}>
                  {selectedAIAnalysis?.disruptionProbability
                    ? `${Math.round(selectedAIAnalysis.disruptionProbability * 100)}%`
                    : '91%'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Affected Road:</Text>
                <Text style={styles.sheetVal}>{selectedAIAnalysis?.affectedRoad || activeRoute?.affectedRoad || 'NH-13 Bomdila Stretch'}</Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Analysis Status:</Text>
                <Text style={[styles.sheetVal, { color: '#047857', fontWeight: '700' }]}>
                  {selectedAIAnalysis?.analysisStatus || 'COMPLETED'}
                </Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Model Name:</Text>
                <Text style={styles.sheetVal}>{selectedAIAnalysis?.modelName || 'NER-RouteGuard Risk Model'}</Text>
              </View>
              <View style={styles.sheetDetailRow}>
                <Text style={styles.sheetLabel}>Model Version:</Text>
                <Text style={styles.sheetVal}>{selectedAIAnalysis?.modelVersion || '1.0'}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Profile Modal */}
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
    paddingBottom: 40,
  },
  headerTitleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  titleBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  titleSub: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 3,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  inputSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  coordRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontWeight: '600',
  },
  useLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 10,
  },
  useLocationBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  findRouteBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  findRouteBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waitingStepText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 12,
  },
  errorCardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    flex: 1,
  },
  warningBanner: {
    backgroundColor: '#FFEDD5',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDBA74',
    marginBottom: 12,
  },
  warningBannerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
    flex: 1,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginTop: 2,
  },
  mapHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  routeInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusTagActive: {
    backgroundColor: '#ECFDF5',
  },
  statusTagCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  infoGridItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  gridItemLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  gridItemValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  infoDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoDetailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  infoDetailValue: {
    fontSize: 11,
    color: '#0F172A',
  },
  transitBtn: {
    backgroundColor: '#2563EB',
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  completeBtn: {
    backgroundColor: '#10B981',
  },
  transitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  completedBoxText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  noRouteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
    gap: 6,
  },
  noRouteText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  reportSheetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  aiCard: {
    borderColor: '#DDD6FE',
    backgroundColor: '#FAF5FF',
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  sheetTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  sheetBody: {
    gap: 4,
  },
  sheetDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  sheetLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sheetVal: {
    fontSize: 11,
    color: '#0F172A',
  },
});
