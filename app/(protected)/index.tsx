import { AuthContext } from '@/utils/authContext';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index () {

    const authContext = useContext(AuthContext);
  return (
    <SafeAreaView>
      <Text>Index screen main page  </Text>

   

      <TouchableOpacity onPress={authContext.logOut}   >
      <Text>LOg out  </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})