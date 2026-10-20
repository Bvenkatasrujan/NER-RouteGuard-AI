import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle, StyleProp,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/theme';
import { ClayShadows } from '../../constants/shadows';

interface ClayCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'card' | 'floating' | 'inset';
  onPress?: () => void;
  activeOpacity?: number;
  radius?: number;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  style,
  variant = 'card',
  onPress,
  activeOpacity = 0.85,
  radius,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const getShadowStyle = () => {
    switch (variant) {
      case 'floating':
        return ClayShadows.cardFloating;
      case 'inset':
        return ClayShadows.inset;
      case 'card':
      default:
        return ClayShadows.card;
    }
  };

  const customRadius = radius ? { borderRadius: radius } : null;

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.base, getShadowStyle(), customRadius, style]}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.base, getShadowStyle(), customRadius, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 18,
    marginVertical: 8,
  },
});
