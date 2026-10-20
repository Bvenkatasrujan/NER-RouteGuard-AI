import React from 'react';
import { Stack } from 'expo-router';

export default function OfficerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}

