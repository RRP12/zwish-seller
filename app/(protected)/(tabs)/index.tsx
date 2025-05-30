import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatCard from '../../../components/dashboard/StatCard';

const sellerProfileImage = require('../../../assets/images/sellerprofileicon.png'); // Adjusted path

const BOTTOM_NAV_HEIGHT = 73; // This constant will be used for padding

// Updated dummy data to reflect Figma more closely
const figmaStatsData = {
  views: { title: 'Views', value: '10K', period: 'In last 30 days' },
  sales: { title: 'Sales', value: '12.1K', period: 'In last 30 days' },
  orders: { title: 'Orders', value: '15', period: 'In last 30 days' },
  returns: { title: 'Returns', value: '1', period: 'In last 30 days' },
};

const figmaBoostAdsData = {
  spentOnBoost: { title: 'Spent on boost', value: '500', period: 'In last 30 days' },
  spentOnAds: { title: 'Spent on Ads', value: '1k', period: 'In last 30 days' },
  balance: { title: 'Balance', value: '500', actionText: 'Add Balance' },
};

const DashboardScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header Gradient Area */}
      <LinearGradient
        colors={['#00C9FF', '#148FB1']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <Text style={styles.headerDashboardTitle}>Dashboard</Text>
        <Image source={sellerProfileImage} style={styles.profileImage} />
        <Text style={styles.headerStoreName}>LikeRA</Text>

        {/* Stats Cards within Header */}
        <View style={styles.headerStatsContainer}>
          <View style={styles.headerStatsRow}>
            <StatCard {...figmaStatsData.views} cardType="header" />
            <StatCard {...figmaStatsData.sales} cardType="header" />
          </View>
          <View style={styles.headerStatsRow}>
            <StatCard {...figmaStatsData.orders} cardType="header" />
            <StatCard {...figmaStatsData.returns} cardType="header" />
          </View>
        </View>
      </LinearGradient>

      {/* Content Below Header */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 20 }]} // Added +20 for extra spacing if needed, adjust as per original design
      >
        {/* Boost & Ads Section Title */}
        <View style={styles.boostAdsSection}>
          <Text style={styles.boostAdsTitle}>Boost & Ads</Text>
        </View>
        {/* Add other sections here if any more appear on the black background */}
      </ScrollView>

      {/* Boost Ads Row - Positioned Absolutely */}
      <View style={[styles.boostAdsRow, { bottom: BOTTOM_NAV_HEIGHT + insets.bottom + 10 }]}>
        <StatCard {...figmaBoostAdsData.spentOnBoost} cardType="boost" />
        <StatCard {...figmaBoostAdsData.spentOnAds} cardType="boost" />
        <StatCard {...figmaBoostAdsData.balance} cardType="boost" />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  } as ViewStyle,
  headerGradient: {
    width: '100%',
    height: 440,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  } as ViewStyle,
  headerDashboardTitle: {
    fontFamily: 'Baloo',
    fontSize: 32,
    lineHeight: 50,
    color: '#000000',
    textAlign: 'center',
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
  } as TextStyle,
  profileImage: {
    width: 69,
    height: 69,
    borderRadius: 34.5,
    position: 'absolute',
    left: 25,
    top: 75,
  } as ImageStyle,
  headerStoreName: {
    fontFamily: 'Basic',
    fontSize: 32,
    lineHeight: 40,
    color: '#000000',
    position: 'absolute',
    left: 112,
    top: 94,
  } as TextStyle,
  headerStatsContainer: {
    position: 'absolute',
    top: 177,
    width: '100%',
    paddingHorizontal: 30, 
  } as ViewStyle,
  headerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollViewContent: {
    paddingTop: 23,
    paddingHorizontal: 18,
  } as ViewStyle,
  boostAdsSection: {
  } as ViewStyle,
  boostAdsTitle: {
    fontFamily: 'Baloo',
    fontSize: 32,
    lineHeight: 50,
    color: '#FFFFFF',
    marginBottom: 20,
  } as TextStyle,
  boostAdsRow: {
    position: 'absolute',
    // The `bottom` property is now applied dynamically in the JSX
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10, 
    paddingVertical: 10, // Added vertical padding for the container of boost cards
    // backgroundColor: 'rgba(0,0,0,0.1)', // Slight background for visual debugging if needed
  } as ViewStyle,
});

export default DashboardScreen;
