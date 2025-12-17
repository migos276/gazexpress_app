import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, TextInput, Pressable, RefreshControl, Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Bouteille } from "@/types";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.xl * 3) / 2;

type ClientHomeScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, "ClientHome">;
};

const MOCK_BOUTEILLES: Bouteille[] = [
  {
    id: 1,
    nom_commercial: "Gaz Total 12kg",
    type: "12kg",
    marque: "Total",
    prix: 6500,
    stock: 25,
    description: "Bouteille de gaz de qualite superieure",
    station: 1,
    station_nom: "Station Total Bastos",
    disponible: true,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300",
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
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300",
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
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300",
  },
  {
    id: 4,
    nom_commercial: "Camgaz Premium 12kg",
    type: "12kg",
    marque: "Camgaz",
    prix: 6200,
    stock: 0,
    station: 4,
    station_nom: "Station Camgaz Essos",
    disponible: false,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300",
  },
];

const filters = ["Tous", "6kg", "12kg", "15kg"];

export default function ClientHomeScreen({ navigation }: ClientHomeScreenProps) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { addItem } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [refreshing, setRefreshing] = useState(false);
  const [bouteilles] = useState(MOCK_BOUTEILLES);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredBouteilles = bouteilles.filter((b) => {
    const matchesSearch = b.nom_commercial.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.marque.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "Tous" || b.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (bouteille: Bouteille) => {
    addItem(bouteille, 1);
  };

  const renderBouteille = ({ item }: { item: Bouteille }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => navigation.navigate("BouteilleDetail", { bouteille: item })}
    >
      <View style={[styles.cardImageContainer, { backgroundColor: theme.backgroundSecondary }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
        ) : (
          <Feather name="box" size={40} color={theme.textSecondary} />
        )}
        {item.stock <= 5 && item.stock > 0 ? (
          <View style={[styles.badge, { backgroundColor: Colors.light.warning + "33" }]}>
            <ThemedText type="caption" style={{ color: Colors.light.warning, fontWeight: "600" }}>
              Stock faible
            </ThemedText>
          </View>
        ) : !item.disponible ? (
          <View style={[styles.badge, { backgroundColor: Colors.light.error + "33" }]}>
            <ThemedText type="caption" style={{ color: Colors.light.error, fontWeight: "600" }}>
              Indisponible
            </ThemedText>
          </View>
        ) : null}
      </View>
      <View style={styles.cardContent}>
        <ThemedText type="small" numberOfLines={2} style={{ fontWeight: "600" }}>
          {item.nom_commercial}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: 2 }}>
          {item.station_nom}
        </ThemedText>
        <View style={styles.cardFooter}>
          <ThemedText type="bodyLarge" style={{ color: theme.primary, fontWeight: "700" }}>
            {item.prix.toLocaleString()} XAF
          </ThemedText>
          {item.disponible ? (
            <Pressable
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => handleAddToCart(item)}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredBouteilles}
        renderItem={renderBouteille}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
              <Feather name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Rechercher une bouteille..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={20} color={theme.textSecondary} />
                </Pressable>
              ) : null}
            </View>
            <View style={styles.filtersContainer}>
              {filters.map((filter) => (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedFilter === filter ? theme.primary : theme.backgroundDefault,
                      borderColor: selectedFilter === filter ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <ThemedText
                    type="caption"
                    style={{
                      color: selectedFilter === filter ? "#FFFFFF" : theme.text,
                      fontWeight: "600",
                    }}
                  >
                    {filter}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
              Aucune bouteille trouvee
            </ThemedText>
          </View>
        }
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
  header: {
    marginBottom: Spacing.lg,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  cardImageContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: Spacing.xs,
    left: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xxxl,
  },
});
