import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '../store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { firebaseUser, user, loading } = useAuth();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (!firebaseUser || !user) {
        router.replace('/login');
        return;
      }

      // Check valid roles
      const validRoles = ['DRIVER', 'FIELD_OFFICER', 'ADMIN', 'driver', 'field_officer'];
      if (!user.role || !validRoles.includes(user.role)) {
        router.replace('/login');
        return;
      }

      // Route directly to primary Home screen
      if (user.role === 'DRIVER' || user.role === 'driver') {
        router.replace('/(driver)/home');
      } else {
        router.replace('/(officer)/home');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, firebaseUser, user]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Simple Blue Location / Road / Mountain Logo Emblem */}
        <View style={styles.logoBadge}>
          <Svg width={54} height={54} viewBox="0 0 48 48" fill="none">
            <Path
              d="M24 4C14.06 4 6 12.06 6 22C6 33.25 21.1 43.14 23.25 44.5C23.7 44.8 24.3 44.8 24.75 44.5C26.9 43.14 42 33.25 42 22C42 12.06 33.94 4 24 4Z"
              fill="#1D4ED8"
            />
            {/* Mountain / Road Peak Overlay */}
            <Path
              d="M14 28L20 18L26 25L34 14L40 28H14Z"
              fill="#FFFFFF"
              fillOpacity={0.9}
            />
            <Circle cx="24" cy="18" r="3" fill="#1D4ED8" />
          </Svg>
        </View>

        <Text style={styles.title}>NER-RouteGuard AI</Text>
        <Text style={styles.subtitle}>Smart Logistics & Accessibility Intelligence</Text>

        {/* Simple Blue Telemetry Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
        </View>

        <Text style={styles.footerTag}>Govt of India / MoDNER Operational Grid</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 32,
  },
  progressTrack: {
    width: 200,
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1D4ED8',
    borderRadius: 2,
  },
  footerTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
