import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import LivreurHomeScreen from "@/screens/livreur/LivreurHomeScreen";
import LivraisonsScreen from "@/screens/livreur/LivraisonsScreen";
import LivreurStatsScreen from "@/screens/livreur/LivreurStatsScreen";
import LivreurProfileScreen from "@/screens/livreur/LivreurProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, Colors } from "@/constants/theme";

export type LivreurTabParamList = {
  BouteillesTab: undefined;
  LivraisonsTab: undefined;
  StatsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<LivreurTabParamList>();

export default function LivreurTabNavigator() {
  const { theme, isDark } = useTheme();
  const screenOptions = useScreenOptions();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.roleLivreur,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: Spacing.tabBarHeight + 20,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        ...screenOptions,
      }}
    >
      <Tab.Screen
        name="BouteillesTab"
        component={LivreurHomeScreen}
        options={{
          headerTitle: "Bouteilles disponibles",
          title: "Bouteilles",
          tabBarIcon: ({ color, size }) => (
            <Feather name="box" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LivraisonsTab"
        component={LivraisonsScreen}
        options={{
          headerTitle: "Mes livraisons",
          title: "Livraisons",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Feather name="truck" size={size} color={color} />
              <View style={[styles.badge, { backgroundColor: Colors.light.secondary }]}>
                <ThemedText type="caption" style={styles.badgeText}>2</ThemedText>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={LivreurStatsScreen}
        options={{
          headerTitle: "Statistiques",
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={LivreurProfileScreen}
        options={{
          headerTitle: "Mon profil",
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
