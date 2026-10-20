import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../constants/colors';
import { ClayShadows } from '../../constants/shadows';

interface ClayIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const ClayIconButton: React.FC<ClayIconButtonProps> = ({
  icon,
  onPress,
  size = 46,
  style,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          ClayShadows.card,
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginVertical: 0,
  },
});
