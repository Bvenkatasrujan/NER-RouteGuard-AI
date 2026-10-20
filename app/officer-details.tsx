import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useAuth } from '../store/authStore';
import { authService } from '../services/firebase/authService';

export default function FieldOfficerDetailsScreen() {
  const router = useRouter();
  const { firebaseUser, user, loading } = useAuth();

  const [name, setName] = useState(user?.name || 'Officer Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 12345');
  const email = firebaseUser?.email || user?.email || 'officer@routeguard.gov.in';

  const [officerId, setOfficerId] = useState(user?.officerId || 'FO-NER-4412');
  const [designation, setDesignation] = useState(user?.designation || 'Senior Field Inspector');
  const [department, setDepartment] = useState(user?.department || 'PWD / BRO Disaster Cell');
  const [district, setDistrict] = useState(user?.district || 'West Kameng');

  // MANUAL COORDINATE ENTRY (DO NOT AUTOMATICALLY DETECT!)
  const [latitude, setLatitude] = useState('27.3541');
  const [longitude, setLongitude] = useState('92.2214');
  const [currentStatus, setCurrentStatus] = useState('ACTIVE');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your Name.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter your Phone Number.');
      return;
    }

    if (!officerId.trim()) {
      Alert.alert('Required', 'Please enter your Officer ID.');
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      Alert.alert('Invalid Coordinate', 'Latitude must be a number between -90 and 90.');
      return;
    }

    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      Alert.alert('Invalid Coordinate', 'Longitude must be a number between -180 and 180.');
      return;
    }

    setSubmitting(true);
    try {
      if (firebaseUser) {
        await authService.createOrUpdateUserProfile(firebaseUser.uid, email, 'FIELD_OFFICER', {
          name: name.trim(),
          phone: phone.trim(),
        });
      }

      Alert.alert('Profile Saved', 'Field Officer profile updated successfully!');
      router.replace('/(officer)/home');
    } catch (err: any) {
      Alert.alert('Save Error', err.message || 'Failed to save officer details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTag}>FIELD OFFICER REGISTRATION</Text>
          <Text style={styles.title}>Field Officer Details</Text>
          <Text style={styles.subtitle}>Enter your official designation, district credentials, and manual field coordinates.</Text>
        </View>

        <View style={styles.card}>
          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Officer Sharma"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 12345"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          {/* Email Address (Read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL ADDRESS (AUTO-POPULATED)</Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={email}
              editable={false}
            />
          </View>

          {/* Officer ID */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>OFFICER ID</Text>
            <TextInput
              style={styles.textInput}
              value={officerId}
              onChangeText={setOfficerId}
              placeholder="e.g. FO-NER-4412"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />
          </View>

          {/* Designation */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DESIGNATION</Text>
            <TextInput
              style={styles.textInput}
              value={designation}
              onChangeText={setDesignation}
              placeholder="e.g. Senior Field Inspector"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Department */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DEPARTMENT</Text>
            <TextInput
              style={styles.textInput}
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g. PWD / BRO Disaster Cell"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* District */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DISTRICT</Text>
            <TextInput
              style={styles.textInput}
              value={district}
              onChangeText={setDistrict}
              placeholder="e.g. West Kameng"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Manual Field Coordinates */}
          <View style={styles.manualCoordsBox}>
            <Text style={styles.coordsHeaderTitle}>MANUAL FIELD COORDINATES</Text>
            <Text style={styles.coordsNotice}>
              Enter your current field longitude and latitude manually (-90 to 90 lat, -180 to 180 lng).
            </Text>

            <View style={styles.coordsRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>CURRENT LATITUDE</Text>
                <TextInput
                  style={styles.textInput}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="27.3541"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>CURRENT LONGITUDE</Text>
                <TextInput
                  style={styles.textInput}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="92.2214"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Current Status */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CURRENT STATUS</Text>
            <TextInput
              style={styles.textInput}
              value={currentStatus}
              onChangeText={setCurrentStatus}
              placeholder="ACTIVE"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting || loading}
            activeOpacity={0.85}
          >
            {submitting || loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Save Officer Details ➔</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerBox: {
    marginBottom: 20,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  fieldGroup: {
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
  disabledInput: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
  },
  manualCoordsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  coordsHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.8,
  },
  coordsNotice: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '600',
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  submitBtn: {
    backgroundColor: '#1D4ED8',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
