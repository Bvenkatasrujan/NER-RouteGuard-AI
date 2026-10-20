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

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isDriver = user?.role === 'DRIVER' || user?.role === 'driver';

  const [name, setName] = useState(user?.name || (isDriver ? 'Rajesh Kumar' : 'Sharma Field Officer'));
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  
  // Driver specific fields
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || 'DL-042026-9812');
  const [vehicleId, setVehicleId] = useState(user?.vehicleId || user?.assignedVehicleId || 'NER-RES-001');
  const [vehicleType, setVehicleType] = useState(user?.vehicleType || '4x4 Heavy Tactical Convoy');

  // Field Officer specific fields
  const [officerId, setOfficerId] = useState(user?.officerId || user?.employeeId || 'FO-001');
  const [department, setDepartment] = useState(user?.department || 'Disaster Management & Field Operations');
  const [designation, setDesignation] = useState(user?.designation || 'Senior Sector Inspector');
  const [region, setRegion] = useState(user?.region || 'Assam — Meghalaya Border Grid');

  const [saving, setSaving] = useState(false);

  const handleSaveDetails = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in all essential personal details.');
      return;
    }

    setSaving(true);
    try {
      if (user?.uid) {
        const role = isDriver ? 'DRIVER' : 'FIELD_OFFICER';
        await authService.createOrUpdateUserProfile(user.uid, user.email, role, { name, phone });
      }
      router.replace('/location-permission');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unable to save personal details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.badgeText}>STEP 1 OF 3 • PROFILE SETUP</Text>
          <Text style={styles.title}>
            {isDriver ? 'Driver Profile Details' : 'Field Officer Profile Details'}
          </Text>
          <Text style={styles.subtitle}>
            Please complete your official profile information before accessing the grid.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Contact Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          {isDriver ? (
            <>
              {/* Driving License */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>DRIVING LICENSE NUMBER</Text>
                <TextInput
                  style={styles.input}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  placeholder="e.g. DL-042026-9812"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>

              {/* Assigned Vehicle ID */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ASSIGNED VEHICLE REGISTRATION</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleId}
                  onChangeText={setVehicleId}
                  placeholder="e.g. NER-RES-001"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>

              {/* Vehicle Type */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>VEHICLE TYPE</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleType}
                  onChangeText={setVehicleType}
                  placeholder="e.g. 4x4 Heavy Convoy"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </>
          ) : (
            <>
              {/* Officer ID */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>OFFICER ID / BADGE NO.</Text>
                <TextInput
                  style={styles.input}
                  value={officerId}
                  onChangeText={setOfficerId}
                  placeholder="e.g. FO-001"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>

              {/* Department */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>DEPARTMENT / AGENCY</Text>
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Disaster Management Cell"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Designation */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>OFFICIAL DESIGNATION</Text>
                <TextInput
                  style={styles.input}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder="e.g. Senior Inspector"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Assigned Region */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ASSIGNED OPERATIONAL REGION</Text>
                <TextInput
                  style={styles.input}
                  value={region}
                  onChangeText={setRegion}
                  placeholder="e.g. Arunachal Pradesh Sector 4"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSaveDetails}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Save & Continue ➔</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: '#1E293B',
  },
  primaryBtn: {
    backgroundColor: '#1D4ED8',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
