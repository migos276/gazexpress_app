import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Bouteille } from "@/types";
import { StationStackParamList } from "@/navigation/StationTabNavigator";

type StationCatalogueScreenProps = {
  navigation: NativeStackNavigationProp<StationStackParamList, "Catalogue">;
};

const MOCK_BOUTEILLES: Bouteille[] = [
  { id: 1, nom_commercial: "Gaz Total 12kg", type: "12kg", marque: "Total", prix: 6500, stock: 25, station: 1, station_nom: "Ma Station", disponible: true },
  { id: 2, nom_commercial: "Gaz Total 6kg", type: "6kg", marque: "Total", prix: 3500, stock: 5, station: 1, station_nom: "Ma Station", disponible: true },
  { id: 3, nom_commercial: "Gaz Total 15kg Pro", type: "15kg", marque: "Total", prix: 8500, stock: 0, station: 1, station_nom: "Ma Station", disponible: false },
];

export default function StationCatalogueScreen({ navigation }: StationCatalogueScreenProps) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [bouteilles, setBouteilles] = useState(MOCK_BOUTEILLES);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getStockColor = (stock: number) => {
    if (stock === 0) return Colors.light.error;
    if (stock <= 5) return Colors.light.warning;
    return Colors.light.success;
  };

  const getStockPercentage = (stock: number) => {
    const maxStock = 50;
    return Math.min((stock / maxStock) * 100, 100);
  };

  const renderBouteille = ({ item }: { item: Bouteille }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => navigation.navigate("EditBouteille", { bouteille: item })}
    >
      <View style={styles.cardContent}>
        <View style={[styles.productIcon, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="box" size={24} color={theme.textSecondary} />
        </View>
        <View style={styles.productInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>{item.nom_commercial}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {item.marque} - {item.type}
          </ThemedText>
          <View style={styles.stockContainer}>
            <View style={[styles.stockBar, { backgroundColor: theme.backgroundSecondary }]}>
              <View
                style={[
                  styles.stockFill,
                  { width: `${getStockPercentage(item.stock)}%`, backgroundColor: getStockColor(item.stock) },
                ]}
              />
            </View>
            <ThemedText type="caption" style={{ color: getStockColor(item.stock), fontWeight: "600" }}>
              {item.stock} en stock
            </ThemedText>
          </View>
        </View>
        <View style={styles.cardRight}>
          <ThemedText type="body" style={{ color: theme.primary, fontWeight: "700" }}>
            {item.prix.toLocaleString()} XAF
          </ThemedText>
          <Pressable style={[styles.editButton, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="edit-2" size={16} color={theme.text} />
          </Pressable>
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
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: theme.primary }}>{bouteilles.length}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Produits</ThemedText>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: Colors.light.success }}>
                {bouteilles.filter((b) => b.disponible).length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Disponibles</ThemedText>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: Colors.light.warning }}>
                {bouteilles.filter((b) => b.stock <= 5 && b.stock > 0).length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Stock faible</ThemedText>
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: Colors.light.secondary, opacity: pressed ? 0.9 : 1, bottom: tabBarHeight + Spacing.xl },
        ]}
        onPress={() => navigation.navigate("AddBouteille")}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
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
  summaryCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  stockBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  stockFill: {
    height: "100%",
    borderRadius: 3,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: Spacing.fabSize,
    height: Spacing.fabSize,
    borderRadius: Spacing.fabSize / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
