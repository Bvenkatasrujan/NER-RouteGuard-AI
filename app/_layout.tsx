import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../store/authStore';
import { IncidentProvider } from '../store/incidentStore';
import { RouteProvider } from '../store/routeStore';

export default function RootLayout() {
  return (
    <AuthProvider>
      <IncidentProvider>
        <RouteProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FFFFFF' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="email-verification" />
            <Stack.Screen name="driver-details" />
            <Stack.Screen name="officer-details" />
            <Stack.Screen name="(driver)" />
            <Stack.Screen name="(officer)" />
          </Stack>
        </RouteProvider>
      </IncidentProvider>
    </AuthProvider>
  );
}
