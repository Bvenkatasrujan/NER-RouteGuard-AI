import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types/auth';

export interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onToggleDutyStatus?: () => void;
  isDutyActive?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  user,
  onSignOut,
  onToggleDutyStatus,
  isDutyActive = true,
}) => {
  if (!user) return null;

  const isOfficer = user.role === 'FIELD_OFFICER';
  const roleLabel = isOfficer ? 'FIELD OFFICER' : user.role === 'ADMIN' ? 'ADMINISTRATOR' : 'LOGISTICS DRIVER';
  const displayName = user.name || 'User Profile';
  const districtName = user.district || 'West Kameng Sector';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>

              {/* Avatar Header */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {displayName ? displayName.substring(0, 2).toUpperCase() : 'U'}
                  </Text>
                </View>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{roleLabel}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Info Rows */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="business-outline" size={16} color="#64748B" />
                  <View style={styles.infoTextCol}>
                    <Text style={styles.infoLabel}>Organization</Text>
                    <Text style={styles.infoValue}>Ministry of Development of North Eastern Region</Text>
                  </View>
                </View>

                {user.vehicleNumber ? (
                  <View style={styles.infoRow}>
                    <Ionicons name="bus-outline" size={16} color="#64748B" />
                    <View style={styles.infoTextCol}>
                      <Text style={styles.infoLabel}>Assigned Vehicle</Text>
                      <Text style={styles.infoValue}>{user.vehicleNumber}</Text>
                    </View>
                  </View>
                ) : null}

                {isOfficer ? (
                  <View style={styles.infoRow}>
                    <Ionicons name="shield-outline" size={16} color="#64748B" />
                    <View style={styles.infoTextCol}>
                      <Text style={styles.infoLabel}>Jurisdiction / Sector</Text>
                      <Text style={styles.infoValue}>{districtName}</Text>
                    </View>
                  </View>
                ) : null}
              </View>

              {/* Duty Toggle if Officer */}
              {isOfficer && onToggleDutyStatus ? (
                <TouchableOpacity
                  style={[styles.dutyBtn, isDutyActive ? styles.dutyBtnActive : styles.dutyBtnInactive]}
                  onPress={onToggleDutyStatus}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isDutyActive ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                    size={18}
                    color={isDutyActive ? '#166534' : '#991B1B'}
                  />
                  <Text style={[styles.dutyBtnText, { color: isDutyActive ? '#166534' : '#991B1B' }]}>
                    {isDutyActive ? 'DUTY STATUS: ON DUTY' : 'DUTY STATUS: OFF DUTY'}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {/* Sign Out Button */}
              <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                <Text style={styles.signOutBtnText}>Sign Out of System</Text>
              </TouchableOpacity>

              <Text style={styles.versionText}>NER-RouteGuard AI • v2.4.0 (SIH 2026 Build)</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 6,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  infoSection: {
    width: '100%',
    gap: 12,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  dutyBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  dutyBtnActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  dutyBtnInactive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  dutyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signOutBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  versionText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 14,
  },
});
