import { updateUserProfile } from '@/utils/sendotp';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

const UserProfileUpdater = ({session}: {session: string}) => {
  const profileData = {
    first_name: 'rushikesh',
    last_name: 'patil',
    email: 'john.doe@example.com',
    gender: 'MALE',
    date_of_birth: '2019-08-24',
    profile_picture: 'https://example.com/profile.jpg',
  };



  const handleUpdateProfile = async () => {
    try {
      const result = await updateUserProfile(profileData , session);
      Alert.alert('Success', 'Profile updated successfully!');
      console.log('Profile updated successfully:', result);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfileUpdater;
