import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Livreur } from "@/types";

const MOCK_LIVREURS: Livreur[] = [
  {
    id: 1,
    user: { id: "1", email: "jean@test.com", nom: "Onana", prenom: "Jean", telephone: "+237699111111", role: "livreur", is_active: true, date_creation: "" },
    vehicule: "Moto Honda",
    immatriculation: "LT 1234 AB",
    zone: { id: 1, nom: "Bastos", frais_livraison: 1500, delai_estime: "30-45 min", is_active: true },
    is_disponible: true,
    note_moyenne: 4.8,
    nombre_livraisons: 156,
  },
  {
    id: 2,
    user: { id: "2", email: "pierre@test.com", nom: "Kamga", prenom: "Pierre", telephone: "+237677222222", role: "livreur", is_active: true, date_creation: "" },
    vehicule: "Moto Yamaha",
    immatriculation: "LT 5678 CD",
    zone: { id: 2, nom: "Melen", frais_livraison: 1000, delai_estime: "20-30 min", is_active: true },
    is_disponible: false,
    note_moyenne: 4.5,
    nombre_livraisons: 89,
  },
];

export default function StationLivreursScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [livreurs] = useState(MOCK_LIVREURS);

  const renderLivreur = ({ item }: { item: Livreur }) => (
    <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: Colors.light.roleLivreur + "20" }]}>
          <ThemedText type="body" style={{ color: Colors.light.roleLivreur, fontWeight: "700" }}>
            {item.user.prenom[0]}{item.user.nom[0]}
          </ThemedText>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {item.user.prenom} {item.user.nom}
          </ThemedText>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color={Colors.light.warning} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: 2 }}>
              {item.note_moyenne} - {item.nombre_livraisons} livraisons
            </ThemedText>
          </View>
        </View>
        <View style={[styles.statusDot, { backgroundColor: item.is_disponible ? Colors.light.success : theme.textSecondary }]} />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Feather name="truck" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {item.vehicule}
          </ThemedText>
        </View>
        <View style={styles.infoItem}>
          <Feather name="hash" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {item.immatriculation}
          </ThemedText>
        </View>
        <View style={styles.infoItem}>
          <Feather name="map-pin" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            Zone: {item.zone.nom}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={[styles.statusBadge, { backgroundColor: item.is_disponible ? Colors.light.success + "20" : theme.backgroundSecondary }]}>
          <ThemedText type="caption" style={{ color: item.is_disponible ? Colors.light.success : theme.textSecondary, fontWeight: "600" }}>
            {item.is_disponible ? "Disponible" : "Indisponible"}
          </ThemedText>
        </View>
        <Pressable style={[styles.callButton, { backgroundColor: Colors.light.success + "15" }]}>
          <Feather name="phone" size={16} color={Colors.light.success} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={livreurs}
        renderItem={renderLivreur}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: theme.primary }}>{livreurs.length}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Total</ThemedText>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: Colors.light.success }}>
                {livreurs.filter((l) => l.is_disponible).length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Disponibles</ThemedText>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <ThemedText type="h2" style={{ color: theme.textSecondary }}>
                {livreurs.filter((l) => !l.is_disponible).length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Occupes</ThemedText>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
