// /Users/rushikeshpatil/zwish-seller/app/(protected)/dashboard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; // Using a mix for variety
import StatCard from '../../components/dashboard/StatCard';
import BottomNavItem from '../../components/dashboard/BottomNavItem';
import { router } from 'expo-router';

// Placeholder for the image - ensure you have this image in your assets
const sellerProfileIcon = require('../../assets/images/sellerprofileicon.png');
const placeholderImage = require('../../assets/images/sellerprofileicon.png'); // Updated to use the only available image

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('Home'); // To manage active tab state

  // Dummy data for stats - replace with actual data fetching
  const statsData = {
    views: { title: 'Views', value: '1.2K', period: 'Last 7 days' },
    sales: { title: 'Sales', value: '₹5.6K', period: 'Last 7 days' },
    orders: { title: 'Orders', value: '32', period: 'Last 7 days' },
    returns: { title: 'Returns', value: '2', period: 'Last 7 days' },
  };

  const boostAdsData = {
    boost: { title: 'Boost Store', value: 'Reach More', actionText: 'Boost Now' },
    ads: { title: 'Run Ads', value: 'Targeted Reach', actionText: 'Create Ad' },
  };

  const handleBottomNavPress = (tabName: string, path?: string) => {
    setActiveTab(tabName);
    if (path) {
      router.push(path as any); // Or router.navigate(path) depending on your setup
    }
    // Handle navigation or state change for other tabs
    console.log(`${tabName} pressed`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00C9FF', '#00A3CC', '#167F97']} // Figma gradient: #00C9FF, #00A3CC, #167F97
        style={styles.header}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Likera</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={sellerProfileIcon} style={styles.profileIconImage} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Dashboard</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Stats Section */}
        <View style={styles.statsRow}>
          <StatCard
            title={statsData.views.title}
            value={statsData.views.value}
            period={statsData.views.period}
            cardType="header"
          />
          <StatCard
            title={statsData.sales.title}
            value={statsData.sales.value}
            period={statsData.sales.period}
            cardType="header"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title={statsData.orders.title}
            value={statsData.orders.value}
            period={statsData.orders.period}
            cardType="boost" // Example of using smallCard prop if needed for different styling
          />
          <StatCard
            title={statsData.returns.title}
            value={statsData.returns.value}
            period={statsData.returns.period}
            cardType="boost" // Example of using smallCard prop
          />
        </View>

        {/* Boost and Ads Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Boost & Ads</Text>
          <View style={styles.boostAdsRow}>
            <StatCard
              title={boostAdsData.boost.title}
              value={boostAdsData.boost.value}
              actionText={boostAdsData.boost.actionText}
              onActionPress={() => console.log('Boost Now Pressed')}
              cardType="boost"
            />
            <StatCard
              title={boostAdsData.ads.title}
              value={boostAdsData.ads.value}
              actionText={boostAdsData.ads.actionText}
              onActionPress={() => console.log('Create Ad Pressed')}
              cardType="boost"
            />
             {/* Placeholder for a third card if design implies it */}
            <View style={styles.emptyCardPlaceholder} />
          </View>
        </View>

        {/* Placeholder Image Section (Likera Exclusive) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Likera Exclusive</Text>
          <Image source={placeholderImage} style={styles.exclusiveImage} resizeMode="cover" />
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem
          iconName="home-outline"
          label="Home"
          isActive={activeTab === 'Home'}
          onPress={() => handleBottomNavPress('Home')}
        />
        <BottomNavItem
          iconName="cube-outline" // Example icon for Products
          label="Products"
          isActive={activeTab === 'Products'}
          onPress={() => handleBottomNavPress('Products', '/products')} // Example path
        />
        <BottomNavItem
          iconName="cart-outline" // Example icon for Orders
          label="Orders"
          isActive={activeTab === 'Orders'}
          onPress={() => handleBottomNavPress('Orders', '/orders')} // Example path
        />
        <BottomNavItem
          iconName="wallet-outline" // Example icon for Payments
          label="Payments"
          isActive={activeTab === 'Payments'}
          onPress={() => handleBottomNavPress('Payments', '/payments')} // Example path
        />
        <BottomNavItem
          iconName="dots-horizontal-circle-outline" // Example icon for More, changed from ellipsis-horizontal-circle-outline
          label="More"
          isActive={activeTab === 'More'}
          onPress={() => handleBottomNavPress('More')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // A light background for the scrollable content area
  },
  header: {
    paddingTop: 40, // Adjust for status bar height
    paddingHorizontal: 20,
    paddingBottom: 10,
    // Figma: height: 120px (content area, not including status bar)
    // Let height be dynamic based on content, or set a fixed one if needed
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Baloo', // TODO: Ensure 'Baloo' font is loaded
    fontSize: 28, // Figma: 28px
    lineHeight: 35, // Figma: 35px
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15, // Spacing between icons
  },
  profileIconImage: {
    width: 28,
    height: 28,
    borderRadius: 14, // Make it circular if it's a profile icon
  },
  headerSubtitle: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 20, // Figma: 20px
    lineHeight: 25, // Figma: 25px
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Ensure content doesn't hide behind bottom nav
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute cards with space
    marginBottom: 10, // Space between rows of cards
  },
  sectionContainer: {
    marginTop: 20, // Space above each new section
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 18, // Figma: 18px
    lineHeight: 23, // Figma: 23px
    color: '#000000',
    marginBottom: 10,
  },
  boostAdsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Or 'space-between'
  },
  emptyCardPlaceholder: { // To maintain layout if only two cards are present in a three-card design
    width: 125, // Same as small StatCard
  },
  exclusiveImage: {
    width: '100%',
    height: 150, // Figma: height: 150px
    borderRadius: 10, // Figma: border-radius: 10px
    backgroundColor: '#E0E0E0', // Placeholder background if image fails to load
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#167F97', // Figma: background: #167F97
    height: 60, // Figma: height: 60px (adjust as needed with padding)
    borderTopWidth: 1,
    borderTopColor: '#00A3CC', // A slightly lighter shade for separation
    position: 'absolute', // Fixed at the bottom
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default DashboardScreen;
