import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Placeholder - replace with actual video data structure
interface VideoItem {
  id: string;
  uri: string; // Actual video URI
  username: string;
  profileImage?: any; // ImageSourcePropType
  description: string;
  likes: number;
  comments: number;
  audioSource?: string; // Added for audio info
  productCount?: number; // Added for product count
}

export default function VideoReelsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // To get passed video data
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [videoData, setVideoData] = useState<VideoItem | null>(null);

  // Dummy video data - replace with actual data fetching or params
  const DUMMY_VIDEO: VideoItem = {
    id: '1',
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Sample video
    username: 'SampleUser', // Plain username
    profileImage: require('@/assets/images/icon.png'), // Replace with actual asset
    description: 'This is a sample video description. #sample #video',
    likes: 1234,
    comments: 56,
    audioSource: 'Original Audio - SoundCreator', // Audio source without '@'
    productCount: 3, // Added dummy product count
  };

  useEffect(() => {
    // In a real app, you would fetch video data based on an ID passed via params
    // For now, we'll use dummy data if no params are passed or handle params.videoId
    if (params.video) { 
      try {
        setVideoData(JSON.parse(params.video as string));
      } catch (e) {
        console.error("Failed to parse video data from params", e);
        setVideoData(DUMMY_VIDEO);
      }
    } else {
      setVideoData(DUMMY_VIDEO);
    }
  }, [params.video]);

  const isPlaying = status?.isLoaded && status.isPlaying;

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
  };

  if (!videoData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading video...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.videoContainer} onPress={handlePlayPause} activeOpacity={0.9}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoData.uri }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          onPlaybackStatusUpdate={newStatus => setStatus(() => newStatus)}
          shouldPlay // Auto-play when screen loads
        />
        {!isPlaying && (
          <View style={styles.playPauseOverlay}>
            <Ionicons name="play" size={80} color="rgba(255, 255, 255, 0.7)" />
          </View>
        )}
      </TouchableOpacity>

      {/* Header: Back button */}
      <View style={styles.headerControls}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.headerRightControls}> 
          <TouchableOpacity style={styles.headerIconRight}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconRight}>
            <Ionicons name="ellipsis-vertical" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Side Controls: Like, Comment, Share, More */}
      <View style={styles.sideControlsContainer}>
        <TouchableOpacity style={styles.sideControlButton}>
          <Ionicons name="heart-outline" size={32} color="white" />
          <Text style={styles.sideControlText}>{videoData.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideControlButton}>
          <Ionicons name="chatbubble-outline" size={32} color="white" />
          <Text style={styles.sideControlText}>{videoData.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideControlButton}>
          <Ionicons name="paper-plane-outline" size={32} color="white" /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideControlButton}>
          <Ionicons name="bookmark-outline" size={32} color="white" /> 
        </TouchableOpacity>
      </View>

      {/* Bottom Info: Profile, Username, Description, View Products */}
      <View style={styles.bottomInfoContainer}>
        <View style={styles.userInfoRow}>
          {videoData.profileImage ? (
            <Image source={videoData.profileImage} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileCircle, { backgroundColor: '#ccc' }]}>
                <Ionicons name="person" size={18} color="#555" />
            </View>
          )}
          <Text style={styles.usernameText}>
            @{videoData.username}
            <Text style={styles.followSeparator}> · </Text>
            <Text style={styles.followLinkText} onPress={() => console.log('Follow pressed')}>Follow</Text>
          </Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={2}>{videoData.description}</Text>
        {/* Added Audio Source Line */}
        {videoData.audioSource && (
          <View style={styles.audioInfoRow}>
            <Ionicons name="musical-notes-outline" size={16} color="white" style={styles.audioIcon} />
            <Text style={styles.audioSourceText}>{videoData.audioSource}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.viewProductsButton}>
          {/* Added shopping bag icon */}
          <Ionicons name="bag-handle-outline" size={20} color="white" style={styles.viewProductsIcon} />
          <Text style={styles.viewProductsButtonText}>
            View products {videoData.productCount ? `(${videoData.productCount})` : ''}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerControls: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50, // Adjust for status bar
    left: 15,
    right: 15, // Added to allow for right controls
    flexDirection: 'row', // Added for layout
    justifyContent: 'space-between', // Added for layout
    alignItems: 'center', // Added for layout
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerRightControls: { 
    flexDirection: 'row',
  },
  headerIconRight: { 
    marginLeft: 20, // Spacing between right icons
    padding: 5,
  },
  sideControlsContainer: {
    position: 'absolute',
    bottom: 150, // Increased bottom margin to lift controls higher
    right: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  sideControlButton: {
    alignItems: 'center',
    marginBottom: 20, // Standardized margin for all side buttons
  },
  sideControlText: {
    color: 'white',
    fontSize: 13,
    marginTop: 4,
  },
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20, // For safe area or nav bar
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background for readability
    zIndex: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8, 
  },
  followSeparator: { 
    color: 'rgba(255, 255, 255, 0.7)', 
    fontWeight: 'bold',
  },
  followLinkText: { 
    color: '#00C9FF', 
    fontWeight: 'bold',
    fontSize: 15, 
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10, 
  },
  audioInfoRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, 
  },
  audioIcon: { 
    marginRight: 6, 
  },
  audioSourceText: { 
    color: '#f0f0f0', 
    fontSize: 13,
  },
  viewProductsButton: {
    backgroundColor: '#00C9FF', 
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewProductsIcon: { 
    marginRight: 8,
  },
  viewProductsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
