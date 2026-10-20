import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle, StyleProp,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii, Typography } from '../../constants/theme';
import { ClayShadows } from '../../constants/shadows';

interface ClayButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'cyan' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 24,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return ClayShadows.buttonSecondary;
      case 'cyan':
        return ClayShadows.buttonCyan;
      case 'danger':
        return {
          backgroundColor: Colors.danger,
          borderRadius: Radii.md,
          shadowColor: Colors.danger,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        };
      case 'primary':
      default:
        return ClayShadows.buttonPrimary;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return Colors.textPrimary;
    return Colors.whiteHighlight;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getButtonStyle(),
          disabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  text: {
    ...Typography.cardHeading,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  disabled: {
    opacity: 0.55,
  },
});
