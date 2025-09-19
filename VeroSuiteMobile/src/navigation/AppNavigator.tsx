// ============================================================================
// VeroField Mobile App - App Navigator
// ============================================================================

import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList, MainTabParamList } from '../types';
import { SCREEN_NAMES, TAB_NAMES } from '../constants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import PhotoCaptureScreen from '../screens/PhotoCaptureScreen';
import SignatureCaptureScreen from '../screens/SignatureCaptureScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={TAB_NAMES.JOBS}
        component={JobsScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_NAMES.PROFILE}
        component={JobsScreen} // Placeholder - will create ProfileScreen later
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_NAMES.SETTINGS}
        component={JobsScreen} // Placeholder - will create SettingsScreen later
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading screen while checking authentication
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#1F2937' }}>Loading VeroField...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <Stack.Screen
            name={SCREEN_NAMES.MAIN}
            component={MainTabNavigator}
          />
        ) : (
          // Unauthenticated screens
          <Stack.Screen
            name={SCREEN_NAMES.LOGIN}
            component={LoginScreen}
          />
        )}
        {/* Additional screens for authenticated users */}
        <Stack.Screen
          name={SCREEN_NAMES.JOB_DETAILS}
          component={JobDetailsScreen}
        />
        <Stack.Screen
          name={SCREEN_NAMES.PHOTO_CAPTURE}
          component={PhotoCaptureScreen}
        />
        <Stack.Screen
          name={SCREEN_NAMES.SIGNATURE_CAPTURE}
          component={SignatureCaptureScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
