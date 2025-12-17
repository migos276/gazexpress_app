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
import { Commande, OrderStatus } from "@/types";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type OrdersScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, "Orders">;
};

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string; icon: string }> = {
  en_attente: { color: Colors.light.warning, label: "En attente", icon: "clock" },
  assignee: { color: Colors.light.info, label: "Assignee", icon: "user-check" },
  en_cours: { color: Colors.light.success, label: "En cours", icon: "truck" },
  livree: { color: Colors.light.textSecondary, label: "Livree", icon: "check-circle" },
  annulee: { color: Colors.light.error, label: "Annulee", icon: "x-circle" },
};

const MOCK_ORDERS: Commande[] = [
  {
    id: 1,
    client: { id: "1", email: "client@test.com", nom: "Dupont", prenom: "Jean", telephone: "+237600000000", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 1, nom_commercial: "Gaz Total 12kg", type: "12kg", marque: "Total", prix: 6500, stock: 25, station: 1, station_nom: "Station Total Bastos", disponible: true },
    quantite: 2,
    prix_total: 13000,
    frais_livraison: 1500,
    montant_total: 14500,
    adresse_livraison: "Bastos, Yaounde",
    statut: "en_cours",
    station: { id: 1, nom: "Station Total Bastos", adresse: "Bastos", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date().toISOString(),
  },
  {
    id: 2,
    client: { id: "1", email: "client@test.com", nom: "Dupont", prenom: "Jean", telephone: "+237600000000", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 2, nom_commercial: "Afrigas 6kg", type: "6kg", marque: "Afrigas", prix: 3500, stock: 42, station: 2, station_nom: "Station Afrigas Melen", disponible: true },
    quantite: 1,
    prix_total: 3500,
    frais_livraison: 1000,
    montant_total: 4500,
    adresse_livraison: "Melen, Yaounde",
    statut: "livree",
    station: { id: 2, nom: "Station Afrigas Melen", adresse: "Melen", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date(Date.now() - 86400000).toISOString(),
    date_livraison: new Date(Date.now() - 80000000).toISOString(),
  },
];

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [orders] = useState(MOCK_ORDERS);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const renderOrder = ({ item }: { item: Commande }) => {
    const statusConfig = STATUS_CONFIG[item.statut];
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.orderCard,
          { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => navigation.navigate("OrderDetail", { order: item })}
      >
        <View style={styles.orderHeader}>
          <View>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Commande #{item.id}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {formatDate(item.date_commande)}
            </ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + "20" }]}>
            <Feather name={statusConfig.icon as any} size={14} color={statusConfig.color} />
            <ThemedText type="caption" style={{ color: statusConfig.color, fontWeight: "600" }}>
              {statusConfig.label}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.orderContent}>
          <View style={[styles.productIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="box" size={20} color={theme.textSecondary} />
          </View>
          <View style={styles.orderInfo}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {item.bouteille.nom_commercial}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Quantite: {item.quantite} - {item.bouteille.station_nom}
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ color: theme.primary, fontWeight: "700" }}>
            {item.montant_total.toLocaleString()} XAF
          </ThemedText>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
              {item.adresse_livraison}
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Pressable>
    );
  };

  if (orders.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.emptyContainer, { paddingTop: headerHeight + Spacing.xxxl }]}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="truck" size={48} color={theme.textSecondary} />
          </View>
          <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>Aucune commande</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}>
            Vos commandes apparaitront ici une fois passees
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  orderCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  orderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  orderInfo: {
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
