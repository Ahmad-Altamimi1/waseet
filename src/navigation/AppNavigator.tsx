import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import {
  RootStackParamList,
  MainTabParamList,
  AuthStackParamList,
} from "../types";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";

// Screens
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import AdminScreen from "../screens/AdminScreen";

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Auth Stack Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: theme.colors.primary.white },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  const { state } = useApp();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "bag" : "bag-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.accent.lavender,
        tabBarInactiveTintColor: theme.colors.neutral.gray500,
        tabBarStyle: {
          backgroundColor: theme.colors.primary.white,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...theme.shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium,
          marginTop: 4,
        },
      })}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <MainTab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarBadge:
            state.currentOrder.length > 0
              ? state.currentOrder.length
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.accent.gold,
            color: theme.colors.text.white,
            fontSize: 10,
            minWidth: 16,
            height: 16,
          },
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </MainTab.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { state } = useApp();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.primary.white },
        }}
      >
        {state.isAuthenticated ? (
          <>
            <RootStack.Screen name="Main" component={MainTabNavigator} />
            <RootStack.Screen
              name="OrderSummary"
              component={OrderSummaryScreen}
              options={{
                presentation: "modal",
                headerShown: true,
                headerTitle: "Order Summary",
                headerStyle: {
                  backgroundColor: theme.colors.primary.white,
                },
                headerTitleStyle: {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.semibold,
                },
                headerTintColor: theme.colors.accent.lavender,
              }}
            />
            <RootStack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{
                headerShown: true,
                headerTitle: "Order Confirmed",
                headerStyle: {
                  backgroundColor: theme.colors.primary.white,
                },
                headerTitleStyle: {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.semibold,
                },
                headerTintColor: theme.colors.accent.lavender,
                headerLeft: () => null, // Disable back button
              }}
            />
            <RootStack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{
                headerShown: true,
                headerTitle: "Track Order",
                headerStyle: {
                  backgroundColor: theme.colors.primary.white,
                },
                headerTitleStyle: {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.semibold,
                },
                headerTintColor: theme.colors.accent.lavender,
              }}
            />
            {state.isAdmin && (
              <RootStack.Screen
                name="Admin"
                component={AdminScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Admin Panel",
                  headerStyle: {
                    backgroundColor: theme.colors.primary.white,
                  },
                  headerTitleStyle: {
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.semibold,
                  },
                  headerTintColor: theme.colors.accent.lavender,
                }}
              />
            )}
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
