import { useSession } from '@/ctx'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface VideoPostProps {
  username: string
  profileColor: string
  thumbnail: any
  profileImage?: any
}

const VideoPost = ({ username, profileColor, thumbnail, profileImage }: VideoPostProps) => {
  return (
    <View style={styles.videoPost}>
      <Image source={thumbnail} style={styles.videoThumbnail} />
      <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <Ionicons name="play" size={36} color="#00C9FF" />
      </View>
      <View style={styles.videoInfo}>
        {profileImage ? (
          <Image source={profileImage} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileCircle, { backgroundColor: profileColor }]}>
            <Text style={styles.profileInitial}>{username.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
  )
}

export default function SocialFeedScreen() {
  const { session } = useSession()
  const [activeTab, setActiveTab] = useState('All')

  // In a real app, these would be actual images from your assets
  const placeholderImage = require('@/assets/images/icon.png')

  const tabs = ['All', 'Men', 'Women', 'Kids']
  
  const videoPosts = [
    { id: 1, username: 'Tanish', profileColor: '#E5B8B0', thumbnail: placeholderImage },
    { id: 2, username: 'Freakins', profileColor: '#D076FF', thumbnail: placeholderImage },
    { id: 3, username: 'Roshan', profileColor: '#E5805B', thumbnail: placeholderImage },
    { id: 4, username: 'Aylsh', profileColor: '#B8B8B0', thumbnail: placeholderImage },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C9FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.headerTitle}>Home </Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </View>
        <Text style={styles.locationText}>Home - 156, 15th Flr, Maker Chamb...</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 70 }} // Add padding for the bottom nav
        showsVerticalScrollIndicator={false}
      >
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Video Feed Grid */}
        <View style={styles.videoGrid}>
          {videoPosts.slice(0, 2).map((post) => (
            <VideoPost
              key={post.id}
              username={post.username}
              profileColor={post.profileColor}
              thumbnail={post.thumbnail}
            />
          ))}
        </View>

        <View style={styles.videoGrid}>
          {videoPosts.slice(2, 4).map((post) => (
            <VideoPost
              key={post.id}
              username={post.username}
              profileColor={post.profileColor}
              thumbnail={post.thumbnail}
            />
          ))}
        </View>
      </ScrollView>
      {/* Bottom navigation now handled by Expo Router tabs */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#00C9FF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 15,
    top: 15,
  },
  iconButton: {
    marginLeft: 15,
  },
  searchContainer: {
    backgroundColor: '#00C9FF',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 0, // Don't add margin, we'll add padding to contentContainerStyle instead
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#222',
  },
  activeTab: {
    backgroundColor: '#3070D9',
  },
  tabText: {
    color: 'white',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  videoPost: {
    width: '48%',
    height: 260,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#444',
  },
  playButton: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  profileInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  username: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
