import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const stats = {
  today: { orders: 12, revenue: 78000 },
  week: { orders: 67, revenue: 435500 },
  month: { orders: 234, revenue: 1521000 },
};

const menuItems = [
  { icon: "home", label: "Informations station" },
  { icon: "clock", label: "Horaires d'ouverture" },
  { icon: "map-pin", label: "Localisation GPS" },
  { icon: "bell", label: "Notifications" },
  { icon: "help-circle", label: "Aide et support" },
];

export default function StationProfileScreen() {
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
          <View style={[styles.avatar, { backgroundColor: Colors.light.roleStation + "20" }]}>
            <Feather name="home" size={32} color={Colors.light.roleStation} />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="h2">Station Total Bastos</ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: Colors.light.roleStation + "20" }]}>
              <Feather name="award" size={12} color={Colors.light.roleStation} />
              <ThemedText type="caption" style={{ color: Colors.light.roleStation, fontWeight: "600", marginLeft: Spacing.xs }}>
                Station partenaire
              </ThemedText>
            </View>
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
              Bastos, Yaounde
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsSection}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Statistiques</ThemedText>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Aujourd'hui</ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary, marginTop: Spacing.xs }}>
                {stats.today.orders}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>commandes</ThemedText>
              <ThemedText type="small" style={{ color: Colors.light.success, fontWeight: "600", marginTop: Spacing.sm }}>
                {stats.today.revenue.toLocaleString()} XAF
              </ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Ce mois</ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary, marginTop: Spacing.xs }}>
                {stats.month.orders}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>commandes</ThemedText>
              <ThemedText type="small" style={{ color: Colors.light.success, fontWeight: "600", marginTop: Spacing.sm }}>
                {stats.month.revenue.toLocaleString()} XAF
              </ThemedText>
            </View>
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
          GazExpress Station v1.0.0
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
    borderRadius: BorderRadius.md,
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
  statsSection: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
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
