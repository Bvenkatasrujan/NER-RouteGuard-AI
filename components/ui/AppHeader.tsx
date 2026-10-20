import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  roleTag?: string;
  isOnline?: boolean;
  onOpenProfile?: () => void;
  onAvatarPress?: () => void;
  userName?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'NER-RouteGuard AI',
  subtitle = 'Logistics & Accessibility Command',
  roleTag = 'MDoNER',
  isOnline = true,
  onOpenProfile,
  onAvatarPress,
  userName,
}) => {
  const handlePress = onAvatarPress || onOpenProfile || (() => {});

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <View style={styles.logoBadge}>
          <Text style={{ fontSize: 16 }}>🛡️</Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{roleTag}</Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.profileBtn}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityLabel="Open Account Menu"
      >
        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10B981' : '#64748B' }]} />
        <Text style={styles.profileBtnText}>{userName ? userName.split(' ')[0] : 'Menu'}</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  textContainer: {
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});
