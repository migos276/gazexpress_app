import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import ClientStackNavigator from "@/navigation/ClientStackNavigator";
import CartScreen from "@/screens/client/CartScreen";
import OrdersScreen from "@/screens/client/OrdersScreen";
import ProfileScreen from "@/screens/client/ProfileScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useCart } from "@/contexts/CartContext";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, Colors } from "@/constants/theme";

export type ClientTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ClientTabParamList>();

export default function ClientTabNavigator() {
  const { theme, isDark } = useTheme();
  const screenOptions = useScreenOptions();
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.roleClient,
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
        name="HomeTab"
        component={ClientStackNavigator}
        options={{
          headerShown: false,
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          headerTitle: "Panier",
          title: "Panier",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Feather name="shopping-cart" size={size} color={color} />
              {itemCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: Colors.light.secondary }]}>
                  <ThemedText type="caption" style={styles.badgeText}>
                    {itemCount > 9 ? "9+" : itemCount}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          headerTitle: "Mes commandes",
          title: "Commandes",
          tabBarIcon: ({ color, size }) => (
            <Feather name="package" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          headerTitle: "Profil",
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
