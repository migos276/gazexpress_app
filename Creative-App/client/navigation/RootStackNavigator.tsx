import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import ClientTabNavigator from "@/navigation/ClientTabNavigator";
import LivreurTabNavigator from "@/navigation/LivreurTabNavigator";
import StationTabNavigator from "@/navigation/StationTabNavigator";
import AdminDrawerNavigator from "@/navigation/AdminDrawerNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Auth: undefined;
  ClientMain: undefined;
  LivreurMain: undefined;
  StationMain: undefined;
  AdminMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const getMainScreen = () => {
    if (!isAuthenticated || !user) {
      return (
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      );
    }

    switch (user.role) {
      case "client":
        return (
          <Stack.Screen
            name="ClientMain"
            component={ClientTabNavigator}
            options={{ headerShown: false }}
          />
        );
      case "livreur":
        return (
          <Stack.Screen
            name="LivreurMain"
            component={LivreurTabNavigator}
            options={{ headerShown: false }}
          />
        );
      case "station":
        return (
          <Stack.Screen
            name="StationMain"
            component={StationTabNavigator}
            options={{ headerShown: false }}
          />
        );
      case "admin":
        return (
          <Stack.Screen
            name="AdminMain"
            component={AdminDrawerNavigator}
            options={{ headerShown: false }}
          />
        );
      default:
        return (
          <Stack.Screen
            name="ClientMain"
            component={ClientTabNavigator}
            options={{ headerShown: false }}
          />
        );
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getMainScreen()}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
