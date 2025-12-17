import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl, Linking, Alert } from "react-native";
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

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string; nextAction?: string; nextStatus?: OrderStatus }> = {
  en_attente: { color: Colors.light.warning, label: "En attente" },
  assignee: { color: Colors.light.info, label: "Assignee", nextAction: "Accepter", nextStatus: "en_cours" },
  en_cours: { color: Colors.light.success, label: "En cours", nextAction: "Livree", nextStatus: "livree" },
  livree: { color: Colors.light.textSecondary, label: "Livree" },
  annulee: { color: Colors.light.error, label: "Annulee" },
};

const MOCK_DELIVERIES: Commande[] = [
  {
    id: 1,
    client: { id: "1", email: "client@test.com", nom: "Mbarga", prenom: "Paul", telephone: "+237699123456", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 1, nom_commercial: "Gaz Total 12kg", type: "12kg", marque: "Total", prix: 6500, stock: 25, station: 1, station_nom: "Station Total Bastos", disponible: true },
    quantite: 2,
    prix_total: 13000,
    frais_livraison: 1500,
    montant_total: 14500,
    adresse_livraison: "Rue 1234, Bastos, Yaounde",
    coordonnees_livraison: { latitude: 3.8667, longitude: 11.5167 },
    statut: "assignee",
    station: { id: 1, nom: "Station Total Bastos", adresse: "Bastos", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date().toISOString(),
  },
  {
    id: 2,
    client: { id: "2", email: "client2@test.com", nom: "Nkolo", prenom: "Marie", telephone: "+237677654321", role: "client", is_active: true, date_creation: "" },
    bouteille: { id: 2, nom_commercial: "Afrigas 6kg", type: "6kg", marque: "Afrigas", prix: 3500, stock: 42, station: 2, station_nom: "Station Afrigas Melen", disponible: true },
    quantite: 1,
    prix_total: 3500,
    frais_livraison: 1000,
    montant_total: 4500,
    adresse_livraison: "Carrefour Melen, Yaounde",
    statut: "en_cours",
    station: { id: 2, nom: "Station Afrigas Melen", adresse: "Melen", telephone: "", email: "", coordonnees_gps: { latitude: 0, longitude: 0 }, horaires: "", is_active: true },
    date_commande: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function LivraisonsScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDeliveries((prev) =>
      prev.map((d) => (d.id === orderId ? { ...d, statut: newStatus } : d))
    );
    if (newStatus === "livree") {
      Alert.alert("Felicitations", "Livraison effectuee avec succes !");
    }
  };

  const renderDelivery = ({ item }: { item: Commande }) => {
    const statusConfig = STATUS_CONFIG[item.statut];
    
    return (
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <View>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Commande #{item.id}
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
          <Feather name="map-pin" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm, flex: 1 }}>
            {item.adresse_livraison}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.callButton, { backgroundColor: Colors.light.success + "15" }]}
            onPress={() => handleCall(item.client.telephone)}
          >
            <Feather name="phone" size={18} color={Colors.light.success} />
            <ThemedText type="caption" style={{ color: Colors.light.success, fontWeight: "600", marginLeft: Spacing.xs }}>
              Appeler
            </ThemedText>
          </Pressable>

          {statusConfig.nextAction && statusConfig.nextStatus ? (
            <Button
              onPress={() => handleStatusChange(item.id, statusConfig.nextStatus!)}
              style={styles.actionButton}
            >
              {statusConfig.nextAction}
            </Button>
          ) : null}
        </View>
      </View>
    );
  };

  const activeDeliveries = deliveries.filter((d) => d.statut === "assignee" || d.statut === "en_cours");

  if (activeDeliveries.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.emptyContainer, { paddingTop: headerHeight + Spacing.xxxl }]}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="truck" size={48} color={theme.textSecondary} />
          </View>
          <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>Aucune livraison</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}>
            Les nouvelles livraisons apparaitront ici
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={activeDeliveries}
        renderItem={renderDelivery}
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
    marginBottom: Spacing.md,
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
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  actionButton: {
    flex: 1,
  },
});
