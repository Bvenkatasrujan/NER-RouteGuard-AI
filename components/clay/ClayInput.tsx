import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle, StyleProp,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii, Typography } from '../../constants/theme';
import { ClayShadows } from '../../constants/shadows';

interface ClayInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ClayInput: React.FC<ClayInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  containerStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          ClayShadows.inset,
          styles.inputWrapper,
          isFocused && styles.focusedBorder,
          !!error && styles.errorBorder,
        ]}
      >
        {leftIcon && <View style={styles.iconSlot}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeSlot}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeText}>{showPassword ? '👁' : '🔒'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: Radii.md,
  },
  input: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  iconSlot: {
    marginRight: 10,
  },
  eyeSlot: {
    padding: 6,
    marginLeft: 6,
  },
  eyeText: {
    fontSize: 16,
  },
  focusedBorder: {
    borderColor: Colors.accentCyan,
    borderWidth: 1.5,
  },
  errorBorder: {
    borderColor: Colors.danger,
    borderWidth: 1.5,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: 4,
    marginLeft: 6,
  },
});
