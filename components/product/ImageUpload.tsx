import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, Text, TextStyle, Image, Platform, Alert, ImageStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImageUploadProps {
  style?: ViewStyle;
  onImageSelected: (uri: string | null) => void;
  initialImageUri?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ style, onImageSelected, initialImageUri }) => {
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri || null);

  const pickImage = async () => {
    // Request permissions if not on web
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Or .All for videos too
      allowsEditing: true,
      aspect: [3, 4], // Aspect ratio for reels/product images, adjust as needed
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
      onImageSelected(selectedUri);
    } else {
      // Optionally handle cancellation or no image selected
      // onImageSelected(null); // if you want to clear it on cancel
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={[styles.container, style]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <MaterialCommunityIcons name="plus" size={60} color="#00C9FF" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160, // Figma: approx width from image
    height: 240, // Figma: approx height from image
    borderRadius: 15, // Figma: border-radius
    borderWidth: 2,
    borderColor: '#00C9FF',
    borderStyle: 'dashed', // Or solid, if preferred. Dashed is common for upload areas.
    backgroundColor: '#1A1A1A', // Darker background for the upload area
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center it in the form
    marginBottom: 30, // Space below the upload area
    overflow: 'hidden', // Ensure image fits within rounded corners
  } as ViewStyle,
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,
});

export default ImageUpload;
