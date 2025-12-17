import React, { useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type CheckoutScreenProps = NativeStackScreenProps<ClientStackParamList, "Checkout">;

const paymentMethods = [
  { id: "mobile_money", label: "Mobile Money", icon: "smartphone", description: "MTN, Orange Money" },
  { id: "carte", label: "Carte bancaire", icon: "credit-card", description: "Visa, Mastercard" },
  { id: "especes", label: "Especes", icon: "dollar-sign", description: "Payer a la livraison" },
];

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { items, getSubtotal, getDeliveryFee, getTotal, selectedZone, deliveryAddress, clearCart } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState("mobile_money");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedZone || !deliveryAddress) {
      Alert.alert("Erreur", "Veuillez selectionner une adresse de livraison");
      return;
    }

    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearCart();
      navigation.reset({
        index: 0,
        routes: [{ name: "OrderSuccess" }],
      });
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + 120 },
        ]}
      >
        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Resume de la commande</ThemedText>
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
            {items.map((item) => (
              <View key={item.bouteille.id} style={styles.summaryItem}>
                <ThemedText type="body" style={{ flex: 1 }}>
                  {item.bouteille.nom_commercial} x{item.quantite}
                </ThemedText>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {(item.bouteille.prix * item.quantite).toLocaleString()} XAF
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Livraison</ThemedText>
          <View style={[styles.addressCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.addressIcon, { backgroundColor: theme.primaryLight }]}>
              <Feather name="map-pin" size={20} color={theme.primary} />
            </View>
            <View style={styles.addressInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {selectedZone?.nom || "Non selectionnee"}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                {deliveryAddress || "Aucune adresse"}
              </ThemedText>
              {selectedZone ? (
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  Delai: {selectedZone.delai_estime}
                </ThemedText>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Mode de paiement</ThemedText>
          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.paymentCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: selectedPayment === method.id ? theme.primary : theme.border,
                  borderWidth: selectedPayment === method.id ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name={method.icon as any} size={20} color={theme.text} />
              </View>
              <View style={styles.paymentInfo}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>{method.label}</ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {method.description}
                </ThemedText>
              </View>
              {selectedPayment === method.id ? (
                <Feather name="check-circle" size={20} color={theme.primary} />
              ) : (
                <View style={[styles.radioOuter, { borderColor: theme.border }]} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={[styles.totalCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.totalRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>Sous-total</ThemedText>
            <ThemedText type="body">{getSubtotal().toLocaleString()} XAF</ThemedText>
          </View>
          <View style={styles.totalRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>Livraison</ThemedText>
            <ThemedText type="body">{getDeliveryFee().toLocaleString()} XAF</ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.totalRow}>
            <ThemedText type="h3">Total a payer</ThemedText>
            <ThemedText type="h2" style={{ color: theme.primary }}>{getTotal().toLocaleString()} XAF</ThemedText>
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, paddingBottom: insets.bottom + Spacing.md }]}>
        <Button 
          onPress={handlePlaceOrder} 
          disabled={isProcessing || !selectedZone}
          style={styles.confirmButton}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <ThemedText type="button" style={{ color: "#FFFFFF" }}>
                Confirmer la commande
              </ThemedText>
            </View>
          )}
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
  section: {
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
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
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: {
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  totalCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
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
  confirmButton: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
