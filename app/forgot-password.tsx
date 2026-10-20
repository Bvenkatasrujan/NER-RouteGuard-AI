import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your registered email address.');
      return;
    }

    setSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      Alert.alert(
        'Reset Email Dispatched',
        `A password reset link has been dispatched to ${email.trim()}.`,
        [{ text: 'Back to Sign In', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      Alert.alert('Reset Failed', err.message || 'Unable to send password reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reset Operational Password</Text>
          <Text style={styles.cardSub}>
            Enter your official email address below to receive a secure password reset link.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="officer@routeguard.gov.in"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleReset}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Send Reset Link ➔</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  submitBtn: {
    backgroundColor: '#1D4ED8',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
