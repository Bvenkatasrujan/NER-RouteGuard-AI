import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithFirebase, signUpWithFirebase, loginWithGoogle, sendPasswordReset, loading } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'DRIVER' | 'FIELD_OFFICER'>('DRIVER');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your Email Address.');
      return;
    }

    if (!password) {
      Alert.alert('Required', 'Please enter your Password.');
      return;
    }

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Weak Password', 'Password should be at least 6 characters.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithFirebase(email.trim(), password, selectedRole);
        // Auth state listener handles redirect in index or auth check
        router.replace('/email-verification');
      } else {
        await signUpWithFirebase(email.trim(), password, selectedRole);
        router.replace('/email-verification');
      }
    } catch (err: any) {
      Alert.alert('Authentication', err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle(selectedRole);
      router.replace('/email-verification');
    } catch (err: any) {
      Alert.alert('Google Auth Error', err.message || 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to receive a password reset link.');
      return;
    }
    try {
      await sendPasswordReset(email.trim());
      Alert.alert('Password Reset', 'A password reset link has been dispatched to your email address.');
    } catch (err: any) {
      Alert.alert('Password Reset Error', err.message || 'Failed to send reset email.');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 28 }}>🛡️</Text>
          </View>
          <Text style={styles.authTitle}>NER-RouteGuard AI</Text>
          <Text style={styles.authSubtitle}>Official Operational Gateway Sign In</Text>
        </View>

        {/* Segmented Control Toggle (LOGIN / SIGN UP) */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, authMode === 'login' && styles.segmentBtnActive]}
            onPress={() => setAuthMode('login')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, authMode === 'login' && styles.segmentBtnTextActive]}>
              LOGIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, authMode === 'signup' && styles.segmentBtnActive]}
            onPress={() => setAuthMode('signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, authMode === 'signup' && styles.segmentBtnTextActive]}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputBox}>
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
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              {authMode === 'login' && (
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Confirm Password */}
          {authMode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          )}

          {/* Role Selector (Sign Up Mode or explicit role choice) */}
          {authMode === 'signup' && (
            <View style={styles.roleSection}>
              <Text style={styles.inputLabel}>CONTINUE AS:</Text>
              <View style={styles.roleGrid}>
                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'DRIVER' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('DRIVER')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.roleCardTitle, selectedRole === 'DRIVER' && styles.roleCardTitleActive]}>
                    Driver
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'FIELD_OFFICER' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('FIELD_OFFICER')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.roleCardTitle, selectedRole === 'FIELD_OFFICER' && styles.roleCardTitleActive]}>
                    Field Officer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleAuthSubmit}
            disabled={isSubmitting || loading}
            activeOpacity={0.85}
          >
            {isSubmitting || loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={isSubmitting || loading}
            activeOpacity={0.85}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                fill="#4285F4"
              />
              <Path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z"
                fill="#34A853"
              />
              <Path
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.96 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                fill="#FBBC05"
              />
              <Path
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                fill="#EA4335"
              />
            </Svg>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerSub}>
            Protected by Government NIC & Firebase Authentication Gateway.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  authSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 10,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 4,
  },
  roleSection: {
    gap: 8,
    marginTop: 4,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  roleCard: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  roleCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  roleCardTitleActive: {
    color: '#2563EB',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
