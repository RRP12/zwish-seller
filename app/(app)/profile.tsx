import { useSession } from '@/ctx';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



// Placeholder for user data - in a real app, this would come from your auth context or API
const userData = {
  name: 'Nikhil',
  // Using a simple avatar component instead of an image file
  profileImage: null, // We'll render a placeholder avatar instead
};

// Menu item component for consistent styling
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const MenuItem = ({ icon, title, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#00C9FF" />
  </TouchableOpacity>
);


export default function ProfileScreen() {
  const router = useRouter();


let {signOut} = useSession()

  const handleBack = () => {
    // router.back();
    signOut()
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen or show modal
    console.log('Edit profile');
  };

  const handleMenuItemPress = (item: string) => {
    // Navigate to respective screens
    console.log(`Navigate to ${item}`);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out');
    signOut();
    // Navigate to sign-in screen after logout
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {/* Simple avatar placeholder with user's initial */}
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Feather name="edit-2" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon={<Feather name="shopping-bag" size={22} color="white" style={styles.menuIcon} />}
            title="Orders"
            onPress={() => handleMenuItemPress('Orders')}
          />
          <MenuItem 
            icon={<Ionicons name="location-outline" size={22} color="white" style={styles.menuIcon} />}
            title="Addresses"
            onPress={() => handleMenuItemPress('Addresses')}
          />
          <MenuItem 
            icon={<Ionicons name="refresh-outline" size={22} color="white" style={styles.menuIcon} />}
            title="Refunds"
            onPress={() => handleMenuItemPress('Refunds')}
          />
          <MenuItem 
            icon={<Ionicons name="language" size={22} color="white" style={styles.menuIcon} />}
            title="Language"
            onPress={() => handleMenuItemPress('Language')}
          />
          <MenuItem 
            icon={<Ionicons name="headset-outline" size={22} color="white" style={styles.menuIcon} />}
            title="Help & Support"
            onPress={() => handleMenuItemPress('Help & Support')}
          />
          <MenuItem 
            icon={<Ionicons name="wallet-outline" size={22} color="white" style={styles.menuIcon} />}
            title="Payment & Wallet"
            onPress={() => handleMenuItemPress('Payment & Wallet')}
          />
          <MenuItem 
            icon={<Ionicons name="person-outline" size={22} color="white" style={styles.menuIcon} />}
            title="Account"
            onPress={() => handleMenuItemPress('Account')}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity  style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#87CEEB', // Light blue background as in the design
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  menuContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#87CEEB', // Light blue as in the design
    marginHorizontal: 30,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
