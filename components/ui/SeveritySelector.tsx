import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SeveritySelectorProps {
  selected: SeverityLevel;
  onSelect: (severity: SeverityLevel) => void;
  disabled?: boolean;
}

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; bg: string; text: string; activeBg: string; activeBorder: string }> = {
  LOW: {
    label: 'LOW',
    bg: '#F0FDF4',
    text: '#166534',
    activeBg: '#DCFCE7',
    activeBorder: '#16A34A',
  },
  MEDIUM: {
    label: 'MED',
    bg: '#FFFBEB',
    text: '#92400E',
    activeBg: '#FEF3C7',
    activeBorder: '#D97706',
  },
  HIGH: {
    label: 'HIGH',
    bg: '#FEF2F2',
    text: '#991B1B',
    activeBg: '#FEE2E2',
    activeBorder: '#DC2626',
  },
  CRITICAL: {
    label: 'CRIT',
    bg: '#450A0A',
    text: '#FFFFFF',
    activeBg: '#7F1D1D',
    activeBorder: '#991B1B',
  },
};

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  const levels: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SEVERITY LEVEL</Text>
      <View style={styles.grid}>
        {levels.map((lvl) => {
          const isSelected = selected === lvl;
          const cfg = SEVERITY_CONFIG[lvl];

          return (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.option,
                { backgroundColor: cfg.bg },
                isSelected && [styles.selectedOption, { backgroundColor: cfg.activeBg, borderColor: cfg.activeBorder }],
                disabled && styles.disabled,
              ]}
              onPress={() => !disabled && onSelect(lvl)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: cfg.text },
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  selectedOptionText: {
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.5,
  },
});
