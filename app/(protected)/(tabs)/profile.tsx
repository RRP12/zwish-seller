import { MaterialCommunityIcons } from '@expo/vector-icons'; // For menu icon placeholder
import React from 'react';
import {
  Image,
  ImageStyle,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const profileImage = require('../../../assets/images/sellerprofileicon.png'); // Adjusted path

const BOTTOM_NAV_HEIGHT = 73; // Consistent with Dashboard

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();

  // Placeholder action for buttons
  const handleEditProfile = () => console.log('Edit Profile Pressed');
  const handleAddNewReel = () => {
    router.push('/(protected)/add-reel');
    console.log('Add New Reel Pressed - Navigating');
  };
  const handleItemEdit = () => console.log('Item Edit Pressed');
  const handleItemBoost = () => console.log('Item Boost Pressed');

  const renderProductItem = (key: string) => (
    <View style={styles.productItemContainer} key={key}>
      <View style={styles.productImage} /> {/* Placeholder View */}
      <TouchableOpacity style={[styles.productButton, styles.editButton]} onPress={handleItemEdit}>
        <Text style={styles.productButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.productButton, styles.boostButton]} onPress={handleItemBoost}>
        <Text style={styles.productButtonText}>Boost</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>LikeRA</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 20 }} // Ensured insets.bottom is used
      >
        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>211</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7K</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>
        <Text style={styles.profileName}>LikeRA</Text>
        <Text style={styles.storeType}>Clothing store</Text>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButtonBlue} onPress={handleEditProfile}>
          <Text style={styles.actionButtonTextBlack}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonOutline} onPress={handleAddNewReel}>
          <Text style={styles.actionButtonTextBlue}>Add new reel</Text>
        </TouchableOpacity>

        {/* Content Grid - Placeholder */}
        <View style={styles.productGrid}>
          {renderProductItem('item1')}
          {renderProductItem('item2')}
          {renderProductItem('item3')}
          {renderProductItem('item4')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 0, 
    height: 60, 
  } as ViewStyle,
  headerTitle: {
    fontFamily: 'Baloo',
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 50, 
  } as TextStyle,
  menuButton: {
  } as ViewStyle,
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, 
    paddingHorizontal: 28, 
  } as ViewStyle,
  profileImage: {
    width: 69,
    height: 69,
    borderRadius: 34.5, 
  } as ImageStyle,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 20, 
  } as ViewStyle,
  statItem: {
    alignItems: 'center',
  } as ViewStyle,
  statValue: {
    fontFamily: 'Basic',
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 40,
  } as TextStyle,
  statLabel: {
    fontFamily: 'Basic',
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 25,
    marginTop: 0, 
  } as TextStyle,
  profileName: {
    fontFamily: 'Basic',
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 25,
    marginTop: 10, 
    marginLeft: 38, 
  } as TextStyle,
  storeType: {
    fontFamily: 'Basic',
    fontSize: 14,
    color: '#00C9FF',
    lineHeight: 18,
    marginLeft: 38, 
    marginBottom: 20,
  } as TextStyle,
  actionButtonBlue: {
    backgroundColor: '#00C9FF',
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 31, 
    marginBottom: 15, 
  } as ViewStyle,
  actionButtonTextBlack: {
    fontFamily: 'Basic',
    fontSize: 20,
    color: '#000000',
    lineHeight: 25,
  } as TextStyle,
  actionButtonOutline: {
    borderColor: '#00C9FF',
    borderWidth: 1,
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 31,
    marginBottom: 30, 
  } as ViewStyle,
  actionButtonTextBlue: {
    fontFamily: 'Basic',
    fontSize: 20,
    color: '#00C9FF',
    lineHeight: 25,
  } as TextStyle,
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Figma: left for first item 20px, right for last item 20px
  } as ViewStyle,
  productItemContainer: {
    width: '48%', // Two items per row with a small gap
    marginBottom: 20,
    alignItems: 'center', // Center buttons below image
  } as ViewStyle,
  productImage: {
    width: '100%', // Make image placeholder take full width of container
    height: 160, // Figma: height: 160px
    backgroundColor: '#D9D9D9', // Placeholder color
    borderRadius: 10, // Figma: border-radius: 10px
    marginBottom: 10, // Space between image and buttons
  } as ViewStyle,
  productButton: {
    width: '80%', // Buttons take 80% of the item container width
    height: 30, // Figma: height: 30px
    borderRadius: 10, // Figma: border-radius: 10px
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5, // Space between buttons if stacked, or from bottom
  } as ViewStyle,
  editButton: {
    backgroundColor: '#8A8A8A', // Figma: background: #8A8A8A
  } as ViewStyle,
  boostButton: {
    backgroundColor: '#00C9FF', // Figma: background: #00C9FF
  } as ViewStyle,
  productButtonText: {
    fontFamily: 'Baloo',
    fontSize: 16, // Figma: font-size: 16px
    color: '#000000', // Figma: color: #000000
    lineHeight: 25, // Figma: line-height: 25px
  } as TextStyle,
});

export default ProfileScreen;
