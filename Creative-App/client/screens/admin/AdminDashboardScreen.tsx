import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { AdminDrawerParamList } from "@/navigation/AdminDrawerNavigator";

type AdminDashboardScreenProps = {
  navigation: DrawerNavigationProp<AdminDrawerParamList, "Dashboard">;
};

const stats = {
  totalClients: 1234,
  totalLivreurs: 45,
  totalStations: 23,
  totalCommandes: 5678,
  revenusTotaux: 45678000,
  commandesJour: 89,
  commandesSemaine: 456,
  commandesMois: 1890,
};

const recentOrders = [
  { id: 1001, client: "Paul M.", montant: 14500, statut: "en_cours" },
  { id: 1002, client: "Marie N.", montant: 7000, statut: "livree" },
  { id: 1003, client: "Jean K.", montant: 8500, statut: "en_attente" },
];

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const renderStatCard = (icon: string, label: string, value: string | number, color: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <ThemedText type="h2" style={{ marginTop: Spacing.sm }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>{label}</ThemedText>
    </View>
  );

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
          <View>
            <ThemedText type="h1">Dashboard</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Vue d'ensemble
            </ThemedText>
          </View>
        </View>

        <View style={[styles.revenueCard, { backgroundColor: Colors.light.roleAdmin }]}>
          <View>
            <ThemedText type="caption" style={{ color: "rgba(255,255,255,0.7)" }}>Revenus totaux</ThemedText>
            <ThemedText type="hero" style={{ color: "#FFFFFF" }}>
              {stats.revenusTotaux.toLocaleString()} XAF
            </ThemedText>
          </View>
          <View style={styles.revenueStats}>
            <View style={styles.revenueStat}>
              <ThemedText type="h3" style={{ color: "#FFFFFF" }}>{stats.commandesJour}</ThemedText>
              <ThemedText type="caption" style={{ color: "rgba(255,255,255,0.7)" }}>Aujourd'hui</ThemedText>
            </View>
            <View style={styles.revenueStat}>
              <ThemedText type="h3" style={{ color: "#FFFFFF" }}>{stats.commandesSemaine}</ThemedText>
              <ThemedText type="caption" style={{ color: "rgba(255,255,255,0.7)" }}>Semaine</ThemedText>
            </View>
            <View style={styles.revenueStat}>
              <ThemedText type="h3" style={{ color: "#FFFFFF" }}>{stats.commandesMois}</ThemedText>
              <ThemedText type="caption" style={{ color: "rgba(255,255,255,0.7)" }}>Mois</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {renderStatCard("users", "Clients", stats.totalClients, Colors.light.roleClient)}
          {renderStatCard("truck", "Livreurs", stats.totalLivreurs, Colors.light.roleLivreur)}
          {renderStatCard("home", "Stations", stats.totalStations, Colors.light.roleStation)}
          {renderStatCard("package", "Commandes", stats.totalCommandes, Colors.light.info)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h3">Commandes recentes</ThemedText>
            <Pressable>
              <ThemedText type="caption" style={{ color: theme.link }}>Voir tout</ThemedText>
            </Pressable>
          </View>
          <View style={[styles.ordersCard, { backgroundColor: theme.backgroundDefault }]}>
            {recentOrders.map((order, index) => (
              <View 
                key={order.id} 
                style={[
                  styles.orderRow,
                  index < recentOrders.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>#{order.id}</ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>{order.client}</ThemedText>
                </View>
                <View style={styles.orderRight}>
                  <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
                    {order.montant.toLocaleString()} XAF
                  </ThemedText>
                  <View style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: order.statut === "livree" ? Colors.light.success + "20" :
                                       order.statut === "en_cours" ? Colors.light.info + "20" :
                                       Colors.light.warning + "20",
                    },
                  ]}>
                    <ThemedText type="caption" style={{ 
                      color: order.statut === "livree" ? Colors.light.success :
                             order.statut === "en_cours" ? Colors.light.info :
                             Colors.light.warning,
                      fontWeight: "600",
                    }}>
                      {order.statut === "livree" ? "Livree" : order.statut === "en_cours" ? "En cours" : "En attente"}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
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
  revenueCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  revenueStats: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    gap: Spacing.xl,
  },
  revenueStat: {
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: "48%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  ordersCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  orderRight: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
});
