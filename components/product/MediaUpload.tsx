import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, Text, TextStyle, Image, Platform, Alert, ImageStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import IMGLYEditor, { EditorSettingsModel, EditorResult } from '@imgly/editor-react-native'; // Added VideoEditorResult

interface MediaUploadProps {
  style?: ViewStyle;
  onMediaSelected: (uri: string | null, mediaType: 'image' | 'video') => void;
  initialImageUri?: string | null;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ style, onMediaSelected, initialImageUri }) => {
  const [mediaUri, setMediaUri] = useState<string | null>(initialImageUri || null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  // const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null); // No longer needed, always video

  const selectMedia = async () => {
    Alert.alert(
      'Select Video Source',
      'Choose an option',
      [
        {
          text: 'Pick from Library',
          onPress: async () => await pickMediaFromLibrary(),
        },
        {
          text: 'Record Video',
          onPress: async () => await recordVideoWithCamera(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickMediaFromLibrary = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need media library permissions to make this work!');
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      allowsEditing: false,
      quality: 1,
    });
    handleMediaResult(result);
  };

  const recordVideoWithCamera = async () => {
    if (Platform.OS !== 'web') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      // Microphone permission is typically bundled with camera permission for video recording
      // or handled by the native camera app itself.
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to record video!');
        return;
      }
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'videos',
      allowsEditing: false, // IMG.LY will handle editing
      quality: 1, // Options: 0 (low), 0.5 (medium), 1 (high)
      // videoMaxDuration: 60, // Optional: limit recording duration in seconds
    });
    handleMediaResult(result);
  };

  const handleMediaResult = async (result: ImagePicker.ImagePickerResult) => {

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const selectedUri = asset.uri;

      setMediaUri(selectedUri);
      setThumbnailUri(null); // Reset thumbnail while new one is generated or editor is open

      // Generate thumbnail for the initially selected video
      try {
        const { uri: generatedThumbnailUri } = await VideoThumbnails.getThumbnailAsync(
          selectedUri,
          { time: 1000 } // Get thumbnail at 1 second into the video
        );
        setThumbnailUri(generatedThumbnailUri);
      } catch (e) {
        console.warn('Could not generate video thumbnail:', e);
        setThumbnailUri(null); // Fallback if thumbnail generation fails
      }

      // Proceed directly to video editor logic
        try {
          console.log(`Attempting to open video editor with URI: ${selectedUri}`);
          console.log(`Video selected with expo-image-picker: ${selectedUri}`);
          console.log('Attempting to open Img.ly editor. The editor might open its own media picker or start in camera mode.');
          
          const settings = new EditorSettingsModel({
            license: 'YOUR_LICENSE_KEY', // Replace with your actual license key
            // Configuration for the editor itself, not for passing the initial asset directly here.
            // We need to find the correct API from Img.ly docs to pass 'selectedUri' to the editor.
            // For now, the editor will likely open without this specific video pre-loaded.
          });

          const editorResult: EditorResult | null = await IMGLYEditor.openEditor(settings);


          console.log('Img.ly Editor Result (full object):', JSON.stringify(editorResult, null, 2));

          if (editorResult) {
            // We have a result from the editor, but its structure is unknown.
            // TODO: Inspect the logged 'editorResult' to determine how to extract the edited video URI.
            // For now, we will use the original selected URI to keep the form flow working.
            console.warn('Img.ly editor returned a result, but its structure is not yet handled. Using original video URI for now. Please inspect logs.');
            // Potentially, the editorResult.uri would be a new video URI.
            // If so, we would: setMediaUri(editorResult.uri) and regenerate thumbnail for it.
            // For now, assuming we stick with selectedUri or editorResult.uri is the same or not yet handled.
            setMediaUri(selectedUri); 
            // If the video changed, we might want to update the thumbnail here as well based on editorResult.uri
            // For now, the existing thumbnail for selectedUri will be shown.
            onMediaSelected(selectedUri, 'video');
          } else {
            console.log('Video editing was canceled or failed. Using original video.');
            onMediaSelected(selectedUri, 'video'); // Fallback to original if editor fails/cancels without result
          }
        } catch (error) {
          console.error('Error opening Img.ly video editor:', error);
          Alert.alert('Editor Error', 'Could not open video editor.');
          onMediaSelected(selectedUri, 'video'); // Fallback to original on error
        }
    } else {
      // Handle cancellation or no media selected
      // onMediaSelected(null, null); // if you want to clear it on cancel
    }
  };

  return (
    <TouchableOpacity onPress={selectMedia} style={[styles.container, style]}>
      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} resizeMode="cover" />
      ) : mediaUri ? (
        // Show a generic video icon if media is selected but thumbnail isn't ready/failed
        <View style={styles.mediaPlaceholder}>
          <MaterialCommunityIcons name="video-outline" size={60} color="#00C9FF" />
          <Text style={styles.mediaPlaceholderText}>Video Processing...</Text>
        </View>
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
    marginBottom: 20, // Spacing below the upload component
    overflow: 'hidden', // Ensures the thumbnail respects border radius
  } as ViewStyle,
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  mediaPlaceholderText: {
    fontFamily: 'Baloo',
    color: '#00C9FF',
    fontSize: 14,
    marginTop: 8,
  } as TextStyle,
  thumbnail: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
});

export default MediaUpload;
