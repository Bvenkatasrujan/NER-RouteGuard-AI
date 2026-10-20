import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export interface SelectorChipOption {
  id: string;
  label: string;
  icon?: string;
}

export interface SelectorChipProps {
  options: SelectorChipOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}

export const SelectorChip: React.FC<SelectorChipProps> = ({
  options,
  selectedId,
  onSelect,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedId;

          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, isSelected && styles.selectedChip]}
              onPress={() => onSelect(opt.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  scrollContainer: {
    gap: 8,
    paddingRight: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedChip: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
