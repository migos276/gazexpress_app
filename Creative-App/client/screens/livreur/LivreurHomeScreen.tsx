import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl, Switch } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Bouteille } from "@/types";

const MOCK_BOUTEILLES: Bouteille[] = [
  {
    id: 1,
    nom_commercial: "Gaz Total 12kg",
    type: "12kg",
    marque: "Total",
    prix: 6500,
    stock: 25,
    station: 1,
    station_nom: "Station Total Bastos",
    station_coordonnees: { latitude: 3.8667, longitude: 11.5167 },
    disponible: true,
  },
  {
    id: 2,
    nom_commercial: "Afrigas 6kg",
    type: "6kg",
    marque: "Afrigas",
    prix: 3500,
    stock: 42,
    station: 2,
    station_nom: "Station Afrigas Melen",
    disponible: true,
  },
  {
    id: 3,
    nom_commercial: "Gaz Tradex 15kg",
    type: "15kg",
    marque: "Tradex",
    prix: 8500,
    stock: 5,
    station: 3,
    station_nom: "Station Tradex Omnisport",
    disponible: true,
  },
];

export default function LivreurHomeScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bouteilles] = useState(MOCK_BOUTEILLES);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderBouteille = ({ item }: { item: Bouteille }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.cardImage, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="box" size={24} color={theme.textSecondary} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText type="body" numberOfLines={1} style={{ fontWeight: "600" }}>
          {item.nom_commercial}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {item.marque} - {item.type}
        </ThemedText>
        <View style={styles.stationRow}>
          <Feather name="map-pin" size={12} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {item.station_nom}
          </ThemedText>
        </View>
      </View>
      <View style={styles.cardRight}>
        <ThemedText type="body" style={{ color: theme.primary, fontWeight: "700" }}>
          {item.prix.toLocaleString()} XAF
        </ThemedText>
        <View style={[styles.stockBadge, { backgroundColor: item.stock > 5 ? Colors.light.success + "20" : Colors.light.warning + "20" }]}>
          <ThemedText type="caption" style={{ color: item.stock > 5 ? Colors.light.success : Colors.light.warning, fontWeight: "600" }}>
            {item.stock} dispo
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={bouteilles}
        renderItem={renderBouteille}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View style={[styles.statusCard, { backgroundColor: isAvailable ? Colors.light.success + "15" : theme.backgroundSecondary }]}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: isAvailable ? Colors.light.success : theme.textSecondary }]} />
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {isAvailable ? "Disponible" : "Indisponible"}
              </ThemedText>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: theme.border, true: Colors.light.success + "50" }}
              thumbColor={isAvailable ? Colors.light.success : theme.textSecondary}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
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
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  stockBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
});
