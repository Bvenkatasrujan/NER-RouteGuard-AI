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
import { useAuth } from '../store/authStore';
import { authService } from '../services/firebase/authService';

export default function NotificationPermissionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';

  const [loading, setLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'denied' | 'permanently_denied'>('idle');

  const updateNotificationPermissionStatus = async (granted: boolean) => {
    if (user?.uid) {
      await authService.createOrUpdateUserProfile(
        user.uid,
        user.email,
        isDriver ? 'DRIVER' : 'FIELD_OFFICER',
        {
          notificationPermissionGranted: granted,
          onboardingCompleted: true,
        }
      );
    }
  };

  const navigateToHome = () => {
    if (isDriver) {
      router.replace('/(driver)/home');
    } else {
      router.replace('/(officer)/home');
    }
  };

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      let status = 'granted';
      let canAskAgain = true;

      try {
        const Notifications = require('expo-notifications');
        if (Notifications && typeof Notifications.requestPermissionsAsync === 'function') {
          const res = await Notifications.requestPermissionsAsync();
          status = res?.status || 'granted';
          canAskAgain = res?.canAskAgain !== false;
        }
      } catch (expoGoError) {
        // Safe Expo Go SDK 53+ remote notifications fallback
        console.log('Expo Go notification fallback handling:', expoGoError);
      }

      if (status === 'granted') {
        await updateNotificationPermissionStatus(true);
        navigateToHome();
      } else {
        await updateNotificationPermissionStatus(false);
        if (canAskAgain === false) {
          setPermissionState('permanently_denied');
        } else {
          setPermissionState('denied');
        }
      }
    } catch (err: any) {
      console.warn('Notification permission error:', err);
      setPermissionState('denied');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    await updateNotificationPermissionStatus(false);
    navigateToHome();
  };

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (e) {
      Alert.alert('Settings', 'Please open your device settings and enable Notifications manually.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        {/* Centered Bell Icon using #1D4ED8 */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🔔</Text>
        </View>

        {permissionState === 'idle' && (
          <>
            <Text style={styles.title}>Stay Updated</Text>

            <Text style={styles.subtitle}>
              Enable notifications to receive important route, shipment and field alerts.
            </Text>

            <Text style={styles.roleSub}>
              {isDriver
                ? 'Receive alerts about route disruptions, road risks, shipment updates and alternate routes.'
                : 'Receive updates about submitted reports, incidents and important field information.'}
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
                  <Text style={styles.primaryBtnText}>Allow Notifications</Text>
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
            <Text style={styles.title}>Notifications are disabled</Text>

            <Text style={styles.subtitle}>
              You can still use RouteGuard, but you might miss urgent route alerts and incident notifications.
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
                <Text style={styles.secondaryTextBtnText}>Continue to Home</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {permissionState === 'permanently_denied' && (
          <>
            <Text style={styles.title}>Notifications are disabled</Text>

            <Text style={styles.subtitle}>
              Notification permissions are disabled for RouteGuard in system settings.
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
                <Text style={styles.secondaryTextBtnText}>Continue to Home</Text>
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
