import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Location from '../../components/Location';

export default function LocationScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to the main app after location is set
    router.push('/(app)');
  };

  const handleAddNewLocation = () => {
    // Navigate to a screen where user can add a new location
    // This could be implemented later
    console.log('Add new location');
  };

  const handleSelectAddress = (address: string) => {
    // Save the selected address and navigate to the main app
    console.log('Selected address:', address);
    router.push('/(app)');
  };

  return (
    <>
      <StatusBar style="light" />
      <Location
        onContinue={handleContinue}
        onAddNewLocation={handleAddNewLocation}
        onSelectAddress={handleSelectAddress}
      />
    </>
  );
}
