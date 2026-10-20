import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DriverDetailsScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to Driver Home Screen according to FINAL DRIVER WORKFLOW spec
    router.replace('/(driver)/home');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
