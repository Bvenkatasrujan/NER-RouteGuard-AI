import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface RouteTimelineProps {
  origin: string;
  destination: string;
  distanceKm?: number | string;
  durationMins?: number | string;
  routeId?: string;
  status?: string;
  waypoints?: string[];
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  origin,
  destination,
  distanceKm,
  durationMins,
  routeId,
  status = 'ASSIGNED',
  waypoints = [],
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.routeBadge}>
          <Ionicons name="map-outline" size={14} color="#2563EB" />
          <Text style={styles.routeBadgeText}>CORRIDOR {routeId ? `#${routeId.slice(-6).toUpperCase()}` : ''}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        {/* Origin */}
        <View style={styles.timelineRow}>
          <View style={styles.nodeColumn}>
            <View style={[styles.nodeDot, styles.originDot]} />
            <View style={styles.nodeLine} />
          </View>
          <View style={styles.nodeContent}>
            <Text style={styles.nodeLabel}>ORIGIN / START POINT</Text>
            <Text style={styles.nodeAddress}>{origin || 'Guwahati Hub'}</Text>
          </View>
        </View>

        {/* Waypoints if any */}
        {waypoints && waypoints.length > 0 ? (
          <View style={styles.timelineRow}>
            <View style={styles.nodeColumn}>
              <View style={[styles.nodeDot, styles.waypointDot]} />
              <View style={styles.nodeLine} />
            </View>
            <View style={styles.nodeContent}>
              <Text style={styles.nodeLabel}>TRANSIT WAYPOINTS ({waypoints.length})</Text>
              <Text style={styles.waypointText} numberOfLines={1}>
                {waypoints.join(' • ')}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Destination */}
        <View style={styles.timelineRow}>
          <View style={styles.nodeColumn}>
            <View style={[styles.nodeDot, styles.destDot]} />
          </View>
          <View style={styles.nodeContent}>
            <Text style={styles.nodeLabel}>DESTINATION</Text>
            <Text style={styles.nodeAddress}>{destination || 'Shillong Sector'}</Text>
          </View>
        </View>
      </View>

      {/* Grid Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Ionicons name="speedometer-outline" size={16} color="#64748B" />
          <View>
            <Text style={styles.statValue}>{distanceKm ? `${distanceKm} km` : 'N/A'}</Text>
            <Text style={styles.statLabel}>Total Distance</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <View>
            <Text style={styles.statValue}>{durationMins ? `${durationMins} mins` : 'N/A'}</Text>
            <Text style={styles.statLabel}>Est. Travel Time</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  timelineContainer: {
    paddingLeft: 4,
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 8,
  },
  nodeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  originDot: {
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  waypointDot: {
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destDot: {
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  nodeLine: {
    width: 2,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  nodeContent: {
    flex: 1,
    paddingBottom: 6,
  },
  nodeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  nodeAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 1,
  },
  waypointText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
  },
});
