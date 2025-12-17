import React from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import StationCatalogueScreen from "@/screens/station/StationCatalogueScreen";
import AddBouteilleScreen from "@/screens/station/AddBouteilleScreen";
import StationOrdersScreen from "@/screens/station/StationOrdersScreen";
import StationLivreursScreen from "@/screens/station/StationLivreursScreen";
import StationProfileScreen from "@/screens/station/StationProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Bouteille } from "@/types";

export type StationStackParamList = {
  Catalogue: undefined;
  AddBouteille: undefined;
  EditBouteille: { bouteille: Bouteille };
};

export type StationTabParamList = {
  CatalogueTab: undefined;
  AddTab: undefined;
  OrdersTab: undefined;
  LivreursTab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<StationStackParamList>();
const Tab = createBottomTabNavigator<StationTabParamList>();

function CatalogueStack() {
  const screenOptions = useScreenOptions();
  
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="Catalogue" 
        component={StationCatalogueScreen} 
        options={{ headerTitle: "Mon catalogue" }}
      />
      <Stack.Screen 
        name="AddBouteille" 
        component={AddBouteilleScreen} 
        options={{ headerTitle: "Nouvelle bouteille" }}
      />
      <Stack.Screen 
        name="EditBouteille" 
        component={AddBouteilleScreen} 
        options={{ headerTitle: "Modifier bouteille" }}
      />
    </Stack.Navigator>
  );
}

function EmptyScreen() {
  return null;
}

export default function StationTabNavigator() {
  const { theme, isDark } = useTheme();
  const screenOptions = useScreenOptions();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.roleStation,
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
        name="CatalogueTab"
        component={CatalogueStack}
        options={{
          headerShown: false,
          title: "Catalogue",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={StationOrdersScreen}
        options={{
          headerTitle: "Commandes",
          title: "Commandes",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Feather name="clipboard" size={size} color={color} />
              <View style={[styles.badge, { backgroundColor: Colors.light.secondary }]}>
                <ThemedText type="caption" style={styles.badgeText}>2</ThemedText>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={EmptyScreen}
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={[styles.addButton, { backgroundColor: Colors.light.secondary }]}>
              <Feather name="plus" size={24} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("CatalogueTab", { screen: "AddBouteille" });
          },
        })}
      />
      <Tab.Screen
        name="LivreursTab"
        component={StationLivreursScreen}
        options={{
          headerTitle: "Livreurs",
          title: "Livreurs",
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StationProfileScreen}
        options={{
          headerTitle: "Profil",
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
