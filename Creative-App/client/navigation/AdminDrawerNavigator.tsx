import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdminDashboardScreen from "@/screens/admin/AdminDashboardScreen";
import AdminUsersScreen from "@/screens/admin/AdminUsersScreen";
import AdminSettingsScreen from "@/screens/admin/AdminSettingsScreen";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

export type AdminDrawerParamList = {
  Dashboard: undefined;
  Users: undefined;
  Stations: undefined;
  Bouteilles: undefined;
  Commandes: undefined;
  Paiements: undefined;
  Zones: undefined;
  Rapports: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.backgroundRoot }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top + Spacing.lg }}>
        <View style={styles.drawerHeader}>
          <View style={[styles.logo, { backgroundColor: Colors.light.roleAdmin }]}>
            <Feather name="shield" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerInfo}>
            <ThemedText type="h3">GazExpress</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>Administration</ThemedText>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
        <Pressable style={styles.footerButton} onPress={logout}>
          <Feather name="log-out" size={20} color={Colors.light.error} />
          <ThemedText type="body" style={{ color: Colors.light.error, marginLeft: Spacing.md }}>
            Deconnexion
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

function PlaceholderScreen({ name }: { name: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.backgroundRoot }]}>
      <ThemedText type="h2">{name}</ThemedText>
      <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
        Ecran en construction
      </ThemedText>
    </View>
  );
}

export default function AdminDrawerNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.light.roleAdmin,
        drawerInactiveTintColor: theme.textSecondary,
        drawerStyle: {
          backgroundColor: theme.backgroundRoot,
          width: 280,
        },
        drawerItemStyle: {
          borderRadius: BorderRadius.sm,
          marginHorizontal: Spacing.sm,
        },
        drawerLabelStyle: {
          marginLeft: -Spacing.md,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          drawerLabel: "Utilisateurs",
          drawerIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Stations"
        options={{
          drawerLabel: "Stations",
          drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Stations" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Bouteilles"
        options={{
          drawerLabel: "Bouteilles",
          drawerIcon: ({ color, size }) => <Feather name="box" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Bouteilles" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Commandes"
        options={{
          drawerLabel: "Commandes",
          drawerIcon: ({ color, size }) => <Feather name="shopping-bag" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Commandes" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Paiements"
        options={{
          drawerLabel: "Paiements",
          drawerIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Paiements" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Zones"
        options={{
          drawerLabel: "Zones",
          drawerIcon: ({ color, size }) => <Feather name="map" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Zones de livraison" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Rapports"
        options={{
          drawerLabel: "Rapports",
          drawerIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        }}
      >
        {() => <PlaceholderScreen name="Rapports" />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        component={AdminSettingsScreen}
        options={{
          drawerLabel: "Parametres",
          drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    marginBottom: Spacing.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    marginLeft: Spacing.md,
  },
  drawerFooter: {
    borderTopWidth: 1,
    padding: Spacing.lg,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
