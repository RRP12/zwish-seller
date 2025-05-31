import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../utils/authContext'; // Import useAuth hook
import SettingsListItem from '../../components/settings/SettingsListItem'; // Adjust path if needed

const SettingsScreen = () => {
  const router = useRouter();
  const auth = useAuth(); // Use the auth context

  const handleLogout = () => {
    console.log('Log out pressed');
    auth.logOut(); // Call the logOut function from auth context
    router.replace('/'); // Navigate to the root, which should redirect to login
  };

  const settingsItems = [
    {
      id: 'account',
      label: 'Account settings',
      iconName: 'person-outline' as React.ComponentProps<typeof Ionicons>['name'],
      iconLibrary: Ionicons,
      action: () => console.log('Account settings pressed'),
    },
    {
      id: 'sellerProfile',
      label: 'Seller Profile',
      iconName: 'account-details-outline' as React.ComponentProps<typeof MaterialCommunityIcons>['name'], // Using a suitable icon
      iconLibrary: MaterialCommunityIcons,
      action: () => router.push('/SellerOnboardingScreen'), // Navigate to SellerOnboardingScreen
    },
    {
      id: 'shopDetails',
      label: 'Shop Details',
      iconName: 'storefront-outline' as React.ComponentProps<typeof Ionicons>['name'], // Using Ionicons store icon
      iconLibrary: Ionicons,
      action: () => router.push('/ShopDetailsScreen'), // Navigate to ShopDetailsScreen
    },
    {
      id: 'address',
      label: 'Shop address',
      iconName: 'location-pin' as React.ComponentProps<typeof MaterialIcons>['name'],
      iconLibrary: MaterialIcons,
      action: () => console.log('Shop address pressed'),
    },
    {
      id: 'bank',
      label: 'Bank & Payment details',
      iconName: 'bank-outline' as React.ComponentProps<typeof MaterialCommunityIcons>['name'],
      iconLibrary: MaterialCommunityIcons,
      action: () => console.log('Bank & Payment details pressed'),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      iconName: 'wallet-outline' as React.ComponentProps<typeof MaterialCommunityIcons>['name'],
      iconLibrary: MaterialCommunityIcons,
      action: () => console.log('Transactions pressed'),
    },
    {
      id: 'refunds',
      label: 'Refunds',
      iconName: 'cash-refund' as React.ComponentProps<typeof MaterialCommunityIcons>['name'],
      iconLibrary: MaterialCommunityIcons,
      action: () => console.log('Refunds pressed'),
    },
    {
      id: 'language',
      label: 'Language',
      iconName: 'language' as React.ComponentProps<typeof Ionicons>['name'],
      iconLibrary: Ionicons,
      action: () => console.log('Language pressed'),
    },
    {
      id: 'help',
      label: 'Help & Support',
      iconName: 'help-buoy-outline' as React.ComponentProps<typeof Ionicons>['name'],
      iconLibrary: Ionicons,
      action: () => console.log('Help & Support pressed'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentContainer}>
          {settingsItems.map(item => {
            const IconComponent = item.iconLibrary;
            return (
              <SettingsListItem
                key={item.id}
                // @ts-ignore // Expo vector icons have different prop types, this is a common workaround
                iconName={item.iconName} 
                label={item.label}
                onPress={item.action}
              />
            );
          })}
        </ScrollView>

        {/* Log out Button */}
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <LinearGradient
              colors={['#86D0E0', '#3B8FA3']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>Log out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    // Based on your CSS: width: 412px, height: 917px - this is usually handled by flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, // Adjusted from left: 25px for back button
    paddingTop: 10, // Approx top: 35px
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10, // Space between back button and title
    // position: absolute, left: 25px, top: 35px (handled by padding and layout)
  },
  headerTitle: {
    fontFamily: 'Basic', // Assuming 'Basic' font is loaded
    fontSize: 20,
    lineHeight: 25,
    color: '#FFFFFF',
    // position: absolute, left: 61px, top: 37px (handled by layout)
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 28, // left: 28px for list items
  },
  logoutButtonContainer: {
    // position: absolute, width: 351px, height: 52px, left: 31px, top: 794px;
    // For responsiveness, center it and give some bottom margin
    alignItems: 'center',
    marginHorizontal: 31,
    marginBottom: 30, // Adjusted from top: 794px (assuming 917px height)
    marginTop: 20,
  },
  logoutButton: {
    width: 351,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontFamily: 'Archivo Black', // Assuming 'Archivo Black' font is loaded
    fontSize: 20,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  // Individual item styles are now in SettingsListItem.tsx
  // but we can add wrappers here if needed for spacing between items
});

export default SettingsScreen;
