import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '../store/authStore';
import { authService } from '../services/firebase/authService';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';

  const [loading, setLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'denied' | 'permanently_denied'>('idle');

  const updateLocationPermissionStatus = async (granted: boolean) => {
    if (user?.uid) {
      await authService.createOrUpdateUserProfile(
        user.uid,
        user.email,
        isDriver ? 'DRIVER' : 'FIELD_OFFICER',
        { locationPermissionGranted: granted }
      );
    }
  };

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await updateLocationPermissionStatus(true);
        router.replace('/notification-permission');
      } else {
        await updateLocationPermissionStatus(false);
        if (!canAskAgain) {
          setPermissionState('permanently_denied');
        } else {
          setPermissionState('denied');
        }
      }
    } catch (err: any) {
      console.warn('Location Permission Error:', err);
      setPermissionState('denied');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    await updateLocationPermissionStatus(false);
    router.replace('/notification-permission');
  };

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (e) {
      Alert.alert('Settings', 'Please open your device settings and enable Location permissions manually.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        {/* Centered Location Icon using #1D4ED8 */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📍</Text>
        </View>

        {permissionState === 'idle' && (
          <>
            <Text style={styles.title}>Enable Location Access</Text>

            <Text style={styles.subtitle}>
              RouteGuard uses your location to provide accurate route tracking, incident reporting and field intelligence.
            </Text>

            <Text style={styles.roleSub}>
              {isDriver
                ? 'Your location helps track your assigned trip and keep your route information up to date.'
                : 'Your location helps attach accurate coordinates to field reports and road observations.'}
            </Text>

            <View style={styles.btnStack}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleRequestPermission}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>Allow Location Access</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={handleContinue}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {permissionState === 'denied' && (
          <>
            <Text style={styles.title}>Location access is disabled</Text>

            <Text style={styles.subtitle}>
              Some RouteGuard features require location access.
            </Text>

            <View style={styles.btnStack}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleRequestPermission}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={handleContinue}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {permissionState === 'permanently_denied' && (
          <>
            <Text style={styles.title}>Enable Location in Settings</Text>

            <Text style={styles.subtitle}>
              Location access is permanently disabled for RouteGuard. Please enable Location in your system settings to continue.
            </Text>

            <View style={styles.btnStack}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleOpenSettings}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Open Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={handleContinue}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  contentBox: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  iconText: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  roleSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnStack: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#1D4ED8',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryTextBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryTextBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
