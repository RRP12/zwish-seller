import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary'; // 'primary' for filled, 'secondary' for outline/different color
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  variant = 'primary',
  buttonStyle,
  textStyle,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        buttonStyle,
      ]}
      {...touchableOpacityProps}
    >
      <Text style={[styles.text, variant === 'primary' ? styles.primaryText : styles.secondaryText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10, // Figma: border-radius
    paddingVertical: 12, // Figma: approx vertical padding for height
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52, // Figma: Button height
    marginVertical: 10, // Space around buttons
  } as ViewStyle,
  primaryButton: {
    backgroundColor: '#00C9FF', // Figma: Save button color
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: '#00C9FF', // Figma: Add Variable button also uses this color
    // If a different style is needed for secondary, adjust here (e.g., borderColor, borderWidth)
  } as ViewStyle,
  text: {
    fontFamily: 'Baloo',
    fontSize: 20, // Figma: font-size
    lineHeight: 25, // Figma: line-height
  } as TextStyle,
  primaryText: {
    color: '#000000', // Figma: text color for Save button
  } as TextStyle,
  secondaryText: {
    color: '#000000', // Figma: text color for Add Variable button
  } as TextStyle,
});

export default FormButton;
