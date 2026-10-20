import { View, StyleSheet, StatusBar, ScrollView, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

interface ClayContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ClayContainer: React.FC<ClayContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgPrimary} />
      
      {/* Background Decorative Ambient Clay Blobs */}
      <View style={styles.ambientBlobTopRight} pointerEvents="none" />
      <View style={styles.ambientBlobBottomLeft} pointerEvents="none" />

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  ambientBlobTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  ambientBlobBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 166, 214, 0.05)',
  },
});
