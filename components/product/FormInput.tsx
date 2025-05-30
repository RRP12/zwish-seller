import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  containerStyle, 
  labelStyle, 
  inputStyle, 
  error, 
  ...textInputProps 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, inputStyle, error ? styles.inputError : null]}
        placeholderTextColor="#6F6F6F" // Figma: placeholder text color
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Figma: Spacing between fields
  } as ViewStyle,
  label: {
    fontFamily: 'Baloo',
    fontSize: 16, 
    color: '#FFFFFF',
    marginBottom: 8, 
  } as TextStyle,
  input: {
    fontFamily: 'Baloo',
    fontSize: 18, 
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A', 
    borderWidth: 1,
    borderColor: '#00C9FF', 
    borderRadius: 10, 
    paddingHorizontal: 15,
    paddingVertical: 12, 
    height: 52, 
  } as TextStyle, 
  inputError: {
    borderColor: '#FF0000', 
  },
  errorText: {
    fontFamily: 'Baloo',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  }
});

export default FormInput;
