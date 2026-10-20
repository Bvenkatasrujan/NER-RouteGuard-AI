import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';

export const GisElevationRadar: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.passTitleRow}>
            <Text style={styles.passTitle}>BARAPANI PASS</Text>
            <View style={styles.elevationBadge}>
              <Text style={styles.elevationText}>ELV 1,496m</Text>
            </View>
          </View>
          <Text style={styles.sectorSubtitle}>Topographic Sector Alpha • NH-27 Khasi Hills Ascent</Text>
        </View>
        <View style={styles.cautionBadge}>
          <View style={styles.cautionDot} />
          <Text style={styles.cautionText}>CAUTION</Text>
        </View>
      </View>

      {/* Mountain Cross Section Vector Elevation Radar */}
      <View style={styles.radarBox}>
        {/* Grid Overlay Lines */}
        <View style={styles.gridOverlay} pointerEvents="none">
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCellNoRight} />
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCellNoRight} />
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCellNoRight} />
          </View>
        </View>

        {/* Tactical Geo Legend Markers */}
        <View style={styles.legendOverlay} pointerEvents="none">
          <View style={styles.syncBadge}>
            <Text style={styles.syncIcon}>🛰️</Text>
            <Text style={styles.syncText}>RADAR SCAN: 3-MIN SYNC</Text>
          </View>
          <View style={styles.shearBadge}>
            <Text style={styles.shearIcon}>⚠️</Text>
            <Text style={styles.shearText}>SLOPE SHEAR 14°</Text>
          </View>
        </View>

        {/* Mountain Pass Silhouette SVG */}
        <Svg width="100%" height={100} viewBox="0 0 320 90" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.45} />
              <Stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.05} />
            </LinearGradient>
            <LinearGradient id="hazardGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#d97706" stopOpacity={0.5} />
              <Stop offset="100%" stopColor="#d97706" stopOpacity={0.08} />
            </LinearGradient>
          </Defs>

          {/* Base Terrain Gradient */}
          <Path
            d="M0,85 L35,65 L70,72 L110,38 L145,52 L175,20 L210,48 L250,30 L290,60 L320,50 L320,90 L0,90 Z"
            fill="url(#passGrad)"
          />

          {/* Hazard Sector Overlay */}
          <Path
            d="M145,52 L175,20 L210,48 L210,90 L145,90 Z"
            fill="url(#hazardGrad)"
          />

          {/* Crisp Topography Line */}
          <Path
            d="M0,85 L35,65 L70,72 L110,38 L145,52 L175,20 L210,48 L250,30 L290,60 L320,50"
            stroke="#0037b0"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hazard Accent Line */}
          <Path
            d="M145,52 L175,20 L210,48"
            stroke="#d97706"
            strokeWidth={3}
            strokeDasharray="4 3"
          />

          {/* Tactical Waypoint Indicator */}
          <Circle cx={175} cy={20} r={6} fill="#d97706" />
          <Circle cx={175} cy={20} r={10} stroke="#d97706" strokeWidth={1.5} opacity={0.6} />
          <Line x1={175} y1={20} x2={175} y2={85} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        </Svg>
      </View>

      {/* Pass Metric Footer Bar */}
      <View style={styles.metricFooter}>
        <View style={styles.metricLeft}>
          <Text style={styles.checkIcon}>✅</Text>
          <View>
            <Text style={styles.accessTitle}>88% ACCESSIBLE</Text>
            <Text style={styles.accessSub}>High-Clearance & 4x4 Convoy</Text>
          </View>
        </View>
        <View style={styles.metricRight}>
          <Text style={styles.satTitle}>SAT-COM 99.4%</Text>
          <Text style={styles.satSub}>INSAT Ku-BAND LNK</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#0B1F33',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEDFF',
  },
  headerRow: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
  },
  passTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131B2E',
    letterSpacing: -0.3,
  },
  elevationBadge: {
    backgroundColor: '#E2E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  elevationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0037B0',
  },
  sectorSubtitle: {
    fontSize: 12,
    color: '#434655',
    marginTop: 3,
  },
  cautionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cautionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  cautionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  radarBox: {
    height: 105,
    backgroundColor: '#F2F3FF',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingHorizontal: 12,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    opacity: 0.25,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#747686',
  },
  gridCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#747686',
  },
  gridCellNoRight: {
    flex: 1,
  },
  legendOverlay: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncIcon: {
    fontSize: 11,
  },
  syncText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#434655',
  },
  shearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shearIcon: {
    fontSize: 11,
  },
  shearText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  metricFooter: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EAEDFF',
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    fontSize: 18,
  },
  accessTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#131B2E',
  },
  accessSub: {
    fontSize: 11,
    color: '#434655',
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  satTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004E47',
  },
  satSub: {
    fontSize: 10,
    color: '#747686',
  },
});
