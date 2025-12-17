import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { AdminDrawerParamList } from "@/navigation/AdminDrawerNavigator";

type AdminSettingsScreenProps = {
  navigation: DrawerNavigationProp<AdminDrawerParamList, "Settings">;
};

const menuItems = [
  { icon: "settings", label: "Configuration generale", section: "config" },
  { icon: "bell", label: "Notifications", section: "notifications" },
  { icon: "credit-card", label: "Parametres de paiement", section: "payment" },
  { icon: "map", label: "Zones de livraison", section: "zones" },
  { icon: "percent", label: "Commissions", section: "commissions" },
  { icon: "file-text", label: "Rapports", section: "reports" },
  { icon: "help-circle", label: "Support", section: "support" },
];

export default function AdminSettingsScreen({ navigation }: AdminSettingsScreenProps) {
  const insets = useSafeAreaInsets();
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
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Feather name="menu" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h1">Parametres</ThemedText>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.avatar, { backgroundColor: Colors.light.roleAdmin + "20" }]}>
            <Feather name="shield" size={28} color={Colors.light.roleAdmin} />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="h3">Administrateur</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>{user?.email}</ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: Colors.light.roleAdmin + "20" }]}>
              <ThemedText type="caption" style={{ color: Colors.light.roleAdmin, fontWeight: "600" }}>
                Super Admin
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: theme.backgroundDefault }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.section}
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
          GazExpress Admin v1.0.0
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
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
