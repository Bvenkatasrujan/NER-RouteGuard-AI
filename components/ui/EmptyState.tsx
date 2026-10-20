import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'shield-checkmark-outline',
  title,
  message,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={32} color="#94A3B8" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
});
