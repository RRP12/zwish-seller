// /Users/rushikeshpatil/zwish-seller/components/dashboard/StatCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  period?: string;
  actionText?: string;
  onActionPress?: (event: GestureResponderEvent) => void;
  cardType: 'header' | 'boost'; // To differentiate card styles
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  period,
  actionText,
  onActionPress,
  cardType,
}) => {
  return (
    <View style={[styles.statCardBase, cardType === 'boost' ? styles.boostCard : styles.headerCard]}>
      {cardType === 'boost' ? (
        <>
          <Text style={[styles.statCardTitle, styles.boostCardTitle]}>{title}</Text>
          <Text style={[styles.statCardValue, styles.boostCardValue]}>{value}</Text>
          {actionText && onActionPress ? (
            <TouchableOpacity
              style={styles.boostActionButtonContainer}
              onPress={onActionPress}
            >
              <Text style={styles.boostActionButtonText}>{actionText}</Text>
            </TouchableOpacity>
          ) : period ? (
            <Text style={[styles.statCardPeriod, styles.boostCardPeriod]}>{period}</Text>
          ) : null}
        </>
      ) : (
        // headerCard logic (original structure)
        <>
          <Text style={[styles.statCardTitle, styles.headerCardTitle]}>{title}</Text>
          <Text style={[styles.statCardValue, styles.headerCardValue]}>{value}</Text>
          {period && (
            <Text style={[styles.statCardPeriod, styles.headerCardPeriod]}>{period}</Text>
          )}
          {actionText && onActionPress && (
            <TouchableOpacity
              style={styles.actionButton} // Existing style for header action
              onPress={onActionPress}
            >
              <Text style={styles.actionButtonText}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statCardBase: {
    backgroundColor: '#167F97',
    borderRadius: 10,
    
    // Simulating box-shadow with elevation for Android and shadow props for iOS
    elevation: 5,
    shadowColor: '#167F97', // Figma uses this color for shadow, might need adjustment
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, // Adjusted for visibility
    shadowRadius: 4,
    
  },
  headerCard: {
    width: 150, // As per Figma
    height: 100, // As per Figma
    marginBottom: 20, // Spacing for grid layout
    padding: 10, // Add padding for header card content
    alignItems: 'flex-start', // Align text to the start for header cards
  },
  boostCard: {
    width: 125, // As per Figma
    height: 90,  // As per Figma
  },
  statCardTitle: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 20,
    lineHeight: 25,
    color: '#FFFFFF',
    marginBottom: 5, // Spacing between title and value
  },
  statCardValue: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 28,
    lineHeight: 35,
    color: '#FFFFFF',
    marginBottom: 5, // Spacing between value and period
  },
  statCardPeriod: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  // Variations for boost cards
  headerCardTitle: {
    // No absolute positioning, relies on padding of headerCard and marginBottom
    // marginBottom is already on statCardTitle, can be overridden if needed
  },
  boostCardTitle: {
    position: 'absolute',
    left: 10,
    top: 6,
    fontFamily: 'Basic',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  headerCardValue: {
    // No absolute positioning, relies on padding of headerCard and marginBottom
    // marginBottom is already on statCardValue, can be overridden if needed
  },
  boostCardValue: {
    position: 'absolute',
    left: 10,
    top: 28,
    fontFamily: 'Basic',
    fontSize: 20,
    lineHeight: 25,
    color: '#FFFFFF',
  },
  headerCardPeriod: {
    // No absolute positioning, relies on padding of headerCard
  },
  boostCardPeriod: {
    position: 'absolute',
    left: 10,
    top: 65,
    fontFamily: 'Basic',
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 3, // Adjusted for height 23px, text 18px
    paddingHorizontal: 10,
    marginTop: 5, // Spacing from value/period
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
  },
  boostActionButtonContainer: {
    position: 'absolute',
    left: 10,
    top: 65,
    width: 101,
    height: 23,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostActionButtonText: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
  },
});

export default StatCard;
