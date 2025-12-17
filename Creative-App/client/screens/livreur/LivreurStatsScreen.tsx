import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const stats = {
  today: { deliveries: 8, earnings: 12000 },
  week: { deliveries: 42, earnings: 63000 },
  month: { deliveries: 156, earnings: 234000 },
  rating: 4.8,
  totalDeliveries: 523,
};

export default function LivreurStatsScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const renderStatCard = (icon: string, label: string, value: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <ThemedText type="h2" style={{ marginTop: Spacing.sm }}>{value}</ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>{label}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.ratingCard, { backgroundColor: Colors.light.warning + "15" }]}>
          <View style={styles.ratingContent}>
            <Feather name="star" size={32} color={Colors.light.warning} />
            <View style={styles.ratingInfo}>
              <ThemedText type="hero" style={{ color: Colors.light.warning }}>{stats.rating}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Note moyenne</ThemedText>
            </View>
          </View>
          <View style={[styles.totalBadge, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>{stats.totalDeliveries}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>livraisons</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Aujourd'hui</ThemedText>
          <View style={styles.statsRow}>
            {renderStatCard("truck", "Livraisons", stats.today.deliveries.toString(), Colors.light.primary)}
            {renderStatCard("dollar-sign", "Revenus", `${stats.today.earnings.toLocaleString()} XAF`, Colors.light.success)}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Cette semaine</ThemedText>
          <View style={styles.statsRow}>
            {renderStatCard("truck", "Livraisons", stats.week.deliveries.toString(), Colors.light.info)}
            {renderStatCard("dollar-sign", "Revenus", `${stats.week.earnings.toLocaleString()} XAF`, Colors.light.success)}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Ce mois</ThemedText>
          <View style={styles.statsRow}>
            {renderStatCard("truck", "Livraisons", stats.month.deliveries.toString(), Colors.light.roleStation)}
            {renderStatCard("dollar-sign", "Revenus", `${stats.month.earnings.toLocaleString()} XAF`, Colors.light.success)}
          </View>
        </View>

        <View style={[styles.performanceCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.lg }}>Performance</ThemedText>
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <ThemedText type="h2" style={{ color: Colors.light.success }}>98%</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Taux de reussite</ThemedText>
            </View>
            <View style={[styles.performanceDivider, { backgroundColor: theme.border }]} />
            <View style={styles.performanceItem}>
              <ThemedText type="h2" style={{ color: Colors.light.info }}>25 min</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Temps moyen</ThemedText>
            </View>
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
  ratingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  ratingInfo: {
    alignItems: "flex-start",
  },
  totalBadge: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "flex-start",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  performanceCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  performanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  performanceItem: {
    flex: 1,
    alignItems: "center",
  },
  performanceDivider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.md,
  },
});
