import React from 'react';
import { Image, ImageStyle, StyleProp, Text, View } from 'react-native';
import { styles } from '../styles/DriverPhoto';

interface DriverPhotoProps {
  imageUrl: string | null;
  driverName: string;
  style?: StyleProp<ImageStyle>;
}

export function DriverPhoto({
  imageUrl,
  driverName,
  style,
}: DriverPhotoProps) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, style]}
        resizeMode="cover"
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={`Photo of ${driverName}`}
      />
    );
  }

  return (
    <View style={[styles.image, styles.placeholder, style]}>
      <Text style={styles.placeholderText}>No Photo</Text>
    </View>
  );
}
