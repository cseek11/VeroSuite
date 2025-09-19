// ============================================================================
// VeroField Mobile App - Card Component
// ============================================================================

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
}) => {
  const cardStyle = [
    styles.card,
    onPress && styles.pressableCard,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressableCard: {
    // Additional styles for pressable cards if needed
  },
});

export default Card;
