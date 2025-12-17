import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type BouteilleDetailScreenProps = NativeStackScreenProps<ClientStackParamList, "BouteilleDetail">;

export default function BouteilleDetailScreen({ route, navigation }: BouteilleDetailScreenProps) {
  const { bouteille } = route.params;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= bouteille.stock) {
      setQuantity(newQuantity);
      Haptics.selectionAsync();
    }
  };

  const handleAddToCart = () => {
    addItem(bouteille, quantity);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const totalPrice = bouteille.prix * quantity;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imageContainer, { backgroundColor: theme.backgroundSecondary }]}>
          {bouteille.image ? (
            <Image source={{ uri: bouteille.image }} style={styles.image} contentFit="cover" />
          ) : (
            <Feather name="box" size={80} color={theme.textSecondary} />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <ThemedText type="h1">{bouteille.nom_commercial}</ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
                {bouteille.marque} - {bouteille.type}
              </ThemedText>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: theme.primaryLight }]}>
              <ThemedText type="button" style={{ color: theme.primary }}>
                {bouteille.type}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.priceCard, { backgroundColor: theme.backgroundDefault }]}>
            <View>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Prix unitaire</ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {bouteille.prix.toLocaleString()} XAF
              </ThemedText>
            </View>
            <View style={[styles.stockBadge, { backgroundColor: bouteille.stock > 5 ? Colors.light.success + "20" : Colors.light.warning + "20" }]}>
              <Feather name="package" size={16} color={bouteille.stock > 5 ? Colors.light.success : Colors.light.warning} />
              <ThemedText type="caption" style={{ color: bouteille.stock > 5 ? Colors.light.success : Colors.light.warning, fontWeight: "600" }}>
                {bouteille.stock} en stock
              </ThemedText>
            </View>
          </View>

          <View style={[styles.stationCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={[styles.stationIcon, { backgroundColor: theme.primaryLight }]}>
              <Feather name="map-pin" size={20} color={theme.primary} />
            </View>
            <View style={styles.stationInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>{bouteille.station_nom}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Station de service</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </View>

          {bouteille.description ? (
            <View style={styles.section}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>Description</ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {bouteille.description}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.section}>
            <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Quantite</ThemedText>
            <View style={styles.quantityContainer}>
              <Pressable
                style={[styles.quantityButton, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Feather name="minus" size={20} color={quantity <= 1 ? theme.textSecondary : theme.text} />
              </Pressable>
              <View style={[styles.quantityValue, { backgroundColor: theme.backgroundDefault }]}>
                <ThemedText type="h2">{quantity}</ThemedText>
              </View>
              <Pressable
                style={[styles.quantityButton, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= bouteille.stock}
              >
                <Feather name="plus" size={20} color={quantity >= bouteille.stock ? theme.textSecondary : theme.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.totalContainer}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Total</ThemedText>
          <ThemedText type="h2" style={{ color: theme.primary }}>
            {totalPrice.toLocaleString()} XAF
          </ThemedText>
        </View>
        <Button 
          onPress={handleAddToCart} 
          style={styles.addButton}
          disabled={!bouteille.disponible}
        >
          <View style={styles.buttonContent}>
            <Feather name="shopping-cart" size={20} color="#FFFFFF" />
            <ThemedText type="button" style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}>
              Ajouter au panier
            </ThemedText>
          </View>
        </Button>
      </View>
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
  imageContainer: {
    height: 250,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    gap: Spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  stationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  stationInfo: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.sm,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    minWidth: 80,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  totalContainer: {
    flex: 1,
  },
  addButton: {
    flex: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
