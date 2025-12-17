import React from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CartItem } from "@/types";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type CartScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, "Cart">;
};

export default function CartScreen({ navigation }: CartScreenProps) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { items, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal, selectedZone } = useCart();

  const handleQuantityChange = (bouteilleId: number, delta: number) => {
    const item = items.find((i) => i.bouteille.id === bouteilleId);
    if (item) {
      updateQuantity(bouteilleId, item.quantite + delta);
      Haptics.selectionAsync();
    }
  };

  const handleRemove = (bouteilleId: number) => {
    removeItem(bouteilleId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.itemImage, { backgroundColor: theme.backgroundSecondary }]}>
        {item.bouteille.image ? (
          <Image source={{ uri: item.bouteille.image }} style={styles.image} contentFit="cover" />
        ) : (
          <Feather name="box" size={24} color={theme.textSecondary} />
        )}
      </View>
      <View style={styles.itemInfo}>
        <ThemedText type="body" numberOfLines={1} style={{ fontWeight: "600" }}>
          {item.bouteille.nom_commercial}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {item.bouteille.prix.toLocaleString()} XAF / unite
        </ThemedText>
        <View style={styles.quantityRow}>
          <Pressable
            style={[styles.qtyButton, { backgroundColor: theme.backgroundSecondary }]}
            onPress={() => handleQuantityChange(item.bouteille.id, -1)}
          >
            <Feather name="minus" size={16} color={theme.text} />
          </Pressable>
          <ThemedText type="body" style={{ marginHorizontal: Spacing.md, fontWeight: "600" }}>
            {item.quantite}
          </ThemedText>
          <Pressable
            style={[styles.qtyButton, { backgroundColor: theme.backgroundSecondary }]}
            onPress={() => handleQuantityChange(item.bouteille.id, 1)}
          >
            <Feather name="plus" size={16} color={theme.text} />
          </Pressable>
        </View>
      </View>
      <View style={styles.itemPrice}>
        <ThemedText type="body" style={{ fontWeight: "700", color: theme.primary }}>
          {(item.bouteille.prix * item.quantite).toLocaleString()} XAF
        </ThemedText>
        <Pressable style={styles.removeButton} onPress={() => handleRemove(item.bouteille.id)}>
          <Feather name="trash-2" size={18} color={theme.error} />
        </Pressable>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.emptyContainer, { paddingTop: headerHeight + Spacing.xxxl }]}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="shopping-bag" size={48} color={theme.textSecondary} />
          </View>
          <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>Panier vide</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}>
            Ajoutez des bouteilles de gaz a votre panier pour passer commande
          </ThemedText>
          <Button onPress={() => navigation.navigate("ClientHome")} style={{ marginTop: Spacing.xl }}>
            Parcourir les bouteilles
          </Button>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.bouteille.id.toString()}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + 180 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListFooterComponent={
          <View style={styles.summary}>
            <Pressable
              style={[styles.addressCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => navigation.navigate("SelectAddress")}
            >
              <View style={[styles.addressIcon, { backgroundColor: theme.primaryLight }]}>
                <Feather name="map-pin" size={20} color={theme.primary} />
              </View>
              <View style={styles.addressInfo}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>Adresse de livraison</ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {selectedZone ? selectedZone.nom : "Selectionner une adresse"}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Pressable>

            <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>Sous-total</ThemedText>
                <ThemedText type="body">{getSubtotal().toLocaleString()} XAF</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>Frais de livraison</ThemedText>
                <ThemedText type="body">{getDeliveryFee().toLocaleString()} XAF</ThemedText>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.summaryRow}>
                <ThemedText type="h3">Total</ThemedText>
                <ThemedText type="h2" style={{ color: theme.primary }}>{getTotal().toLocaleString()} XAF</ThemedText>
              </View>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, paddingBottom: tabBarHeight + Spacing.md }]}>
        <Button onPress={() => navigation.navigate("Checkout")} style={styles.checkoutButton}>
          <View style={styles.buttonContent}>
            <ThemedText type="button" style={{ color: "#FFFFFF" }}>
              Passer au paiement
            </ThemedText>
            <View style={[styles.priceBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <ThemedText type="caption" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                {getTotal().toLocaleString()} XAF
              </ThemedText>
            </View>
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
  cartItem: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  itemPrice: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  removeButton: {
    padding: Spacing.xs,
  },
  summary: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  checkoutButton: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  priceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});
