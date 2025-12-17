import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Commande, OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
  en_attente: { color: Colors.light.warning, label: "En attente" },
  assignee: { color: Colors.light.info, label: "Assignee" },
  en_cours: { color: Colors.light.success, label: "En cours" },
  livree: { color: Colors.light.textSecondary, label: "Livree" },
  annulee: { color: Colors.light.error, label: "Annulee" },
};

const MOCK_ORDERS: Commande[] = [
  {
    id: 101,
    client: { id: "1", email: "client@test.com", nom: "Mbarga", prenom: "Paul", telephone: "+237699123456", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 1, nom_commercial: "Gaz Total 12kg", type: "12kg", marque: "Total", prix: 6500, stock: 25, station: 1, station_nom: "Ma Station", disponible: true },
    quantite: 2,
    prix_total: 13000,
    frais_livraison: 1500,
    montant_total: 14500,
    adresse_livraison: "Bastos, Yaounde",
    statut: "en_attente",
    station: { id: 1, nom: "Ma Station", adresse: "Bastos", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date().toISOString(),
  },
  {
    id: 102,
    client: { id: "2", email: "client2@test.com", nom: "Nkolo", prenom: "Marie", telephone: "+237677654321", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 2, nom_commercial: "Gaz Total 6kg", type: "6kg", marque: "Total", prix: 3500, stock: 42, station: 1, station_nom: "Ma Station", disponible: true },
    quantite: 1,
    prix_total: 3500,
    frais_livraison: 1000,
    montant_total: 4500,
    adresse_livraison: "Melen, Yaounde",
    statut: "assignee",
    station: { id: 1, nom: "Ma Station", adresse: "Bastos", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function StationOrdersScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAssignDriver = (orderId: number) => {
    Alert.alert(
      "Assigner un livreur",
      "Choisir un livreur disponible",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Jean Livreur", 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setOrders((prev) =>
              prev.map((o) => (o.id === orderId ? { ...o, statut: "assignee" as OrderStatus } : o))
            );
          },
        },
      ]
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "pending") return o.statut === "en_attente";
    if (filter === "active") return o.statut === "assignee" || o.statut === "en_cours";
    return true;
  });

  const renderOrder = ({ item }: { item: Commande }) => {
    const statusConfig = STATUS_CONFIG[item.statut];
    
    return (
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <View>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              #{item.id} - {new Date(item.date_commande).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </ThemedText>
            <ThemedText type="h3" style={{ marginTop: Spacing.xs }}>
              {item.client.prenom} {item.client.nom}
            </ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + "20" }]}>
            <ThemedText type="caption" style={{ color: statusConfig.color, fontWeight: "600" }}>
              {statusConfig.label}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.productRow}>
          <View style={[styles.productIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="box" size={18} color={theme.textSecondary} />
          </View>
          <View style={styles.productInfo}>
            <ThemedText type="body">{item.bouteille.nom_commercial}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Quantite: {item.quantite}
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ color: theme.primary, fontWeight: "700" }}>
            {item.montant_total.toLocaleString()} XAF
          </ThemedText>
        </View>

        <View style={styles.addressRow}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {item.adresse_livraison}
          </ThemedText>
        </View>

        {item.statut === "en_attente" ? (
          <Button onPress={() => handleAssignDriver(item.id)} style={{ marginTop: Spacing.md }}>
            Assigner un livreur
          </Button>
        ) : null}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View style={styles.filters}>
            {[
              { key: "all", label: "Toutes" },
              { key: "pending", label: "En attente" },
              { key: "active", label: "En cours" },
            ].map((f) => (
              <Pressable
                key={f.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filter === f.key ? theme.primary : theme.backgroundDefault,
                    borderColor: filter === f.key ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setFilter(f.key as any)}
              >
                <ThemedText
                  type="caption"
                  style={{ color: filter === f.key ? "#FFFFFF" : theme.text, fontWeight: "600" }}
                >
                  {f.label}
                </ThemedText>
              </Pressable>
            ))}
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
  filters: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  productIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
  },
});
