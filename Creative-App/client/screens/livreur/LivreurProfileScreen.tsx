import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert, Switch } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const menuItems = [
  { icon: "user", label: "Informations personnelles" },
  { icon: "truck", label: "Mon vehicule" },
  { icon: "map", label: "Ma zone de livraison" },
  { icon: "bell", label: "Notifications" },
  { icon: "help-circle", label: "Aide et support" },
];

export default function LivreurProfileScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Deconnexion",
      "Etes-vous sur de vouloir vous deconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Deconnecter", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.avatar, { backgroundColor: Colors.light.roleLivreur + "20" }]}>
            <ThemedText type="h1" style={{ color: Colors.light.roleLivreur }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="h2">{user?.prenom} {user?.nom}</ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: Colors.light.roleLivreur + "20" }]}>
              <Feather name="truck" size={12} color={Colors.light.roleLivreur} />
              <ThemedText type="caption" style={{ color: Colors.light.roleLivreur, fontWeight: "600", marginLeft: Spacing.xs }}>
                Livreur
              </ThemedText>
            </View>
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
              {user?.telephone}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.vehicleCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.vehicleIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="truck" size={24} color={theme.text} />
          </View>
          <View style={styles.vehicleInfo}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>Moto - Honda CG 125</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>LT 1234 AB</ThemedText>
          </View>
          <View style={[styles.zoneBadge, { backgroundColor: theme.primaryLight }]}>
            <ThemedText type="caption" style={{ color: theme.primary, fontWeight: "600" }}>Bastos</ThemedText>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: theme.backgroundDefault }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                { backgroundColor: pressed ? theme.backgroundSecondary : "transparent" },
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name={item.icon as any} size={20} color={theme.text} />
              </View>
              <ThemedText type="body" style={styles.menuLabel}>{item.label}</ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            { backgroundColor: Colors.light.error + "10", opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={Colors.light.error} />
          <ThemedText type="body" style={{ color: Colors.light.error, fontWeight: "600", marginLeft: Spacing.md }}>
            Se deconnecter
          </ThemedText>
        </Pressable>

        <ThemedText type="caption" style={[styles.version, { color: theme.textSecondary }]}>
          GazExpress Livreur v1.0.0
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: Spacing.avatarLarge,
    height: Spacing.avatarLarge,
    borderRadius: Spacing.avatarLarge / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    flex: 1,
  },
  zoneBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  menuSection: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  version: {
    textAlign: "center",
  },
});
