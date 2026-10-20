import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface PhotoUploaderProps {
  imageUri: string | null;
  onImagePicked: (uri: string | null) => void;
  label?: string;
  disabled?: boolean;
}

const SAMPLE_EVIDENCE_PHOTO =
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80';

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  imageUri,
  onImagePicked,
  label = 'EVIDENCE PHOTO ATTACHMENT',
  disabled = false,
}) => {
  const handleCapturePhoto = () => {
    if (disabled) return;
    onImagePicked(SAMPLE_EVIDENCE_PHOTO);
    Alert.alert('Photo Captured', 'Ground evidence photo attached with location telemetry.');
  };

  const handlePickGallery = () => {
    if (disabled) return;
    onImagePicked(SAMPLE_EVIDENCE_PHOTO);
    Alert.alert('Photo Selected', 'Field evidence photo selected from gallery.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {imageUri ? (
        <View style={styles.previewCard}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCapturePhoto} disabled={disabled}>
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text style={styles.actionBtnText}>Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.removeBtn]} onPress={() => onImagePicked(null)} disabled={disabled}>
              <Ionicons name="trash-outline" size={16} color="#DC2626" />
              <Text style={[styles.actionBtnText, styles.removeBtnText]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleCapturePhoto} disabled={disabled}>
            <Ionicons name="camera" size={24} color="#2563EB" />
            <Text style={styles.uploadText}>Capture Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickGallery} disabled={disabled}>
            <Ionicons name="images" size={24} color="#475569" />
            <Text style={styles.uploadText}>From Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
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
  uploadOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    flex: 1,
    height: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  previewCard: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#F8FAFC',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  removeBtn: {
    backgroundColor: '#FEF2F2',
  },
  removeBtnText: {
    color: '#DC2626',
  },
});
