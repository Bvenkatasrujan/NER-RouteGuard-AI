import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../store/authStore';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { firebaseUser, user, refreshUserProfile, resendVerificationEmail, logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const userEmail = firebaseUser?.email || user?.email || 'officer@routeguard.gov.in';

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const updatedUser = await refreshUserProfile();
      if (updatedUser?.emailVerified || firebaseUser?.emailVerified) {
        Alert.alert('Email Verified', 'Your email address has been verified successfully!');
        if (updatedUser?.role === 'DRIVER' || updatedUser?.role === 'driver') {
          router.replace('/(driver)/home');
        } else {
          router.replace('/(officer)/home');
        }
      } else {
        Alert.alert(
          'Not Verified Yet',
          'We have not detected your verification yet. Please click the verification link sent to your email inbox and tap Check Verification again.'
        );
      }
    } catch (err: any) {
      Alert.alert('Verification Check', err.message || 'Unable to check verification status.');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      Alert.alert('Verification Dispatched', `A new verification link has been sent to ${userEmail}.`);
    } catch (err: any) {
      Alert.alert('Resend Warning', err.message || 'Verification email sent or rate limited.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 32 }}>✉️</Text>
        </View>

        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.emailBadge}>{userEmail}</Text>

        <Text style={styles.message}>
          We sent a verification link to your email address. Please click the link to verify your official operational account.
        </Text>

        <View style={styles.btnStack}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleCheckVerification}
            disabled={checking}
            activeOpacity={0.85}
          >
            {checking ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Check Verification</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleResendEmail}
            disabled={resending}
            activeOpacity={0.8}
          >
            {resending ? (
              <ActivityIndicator color="#1D4ED8" size="small" />
            ) : (
              <Text style={styles.secondaryBtnText}>Resend Email</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutLink}
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutLinkText}>Sign in with a different account</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  emailBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  btnStack: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#1D4ED8',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  logoutLink: {
    marginTop: 18,
  },
  logoutLinkText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
