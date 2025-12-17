import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { OrderStatus } from "@/types";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type OrderDetailScreenProps = NativeStackScreenProps<ClientStackParamList, "OrderDetail">;

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string; icon: string }> = {
  en_attente: { color: Colors.light.warning, label: "En attente", icon: "clock" },
  assignee: { color: Colors.light.info, label: "Assignee", icon: "user-check" },
  en_cours: { color: Colors.light.success, label: "En cours de livraison", icon: "truck" },
  livree: { color: Colors.light.textSecondary, label: "Livree", icon: "check-circle" },
  annulee: { color: Colors.light.error, label: "Annulee", icon: "x-circle" },
};

const STEPS = [
  { status: "en_attente", label: "Commande recue" },
  { status: "assignee", label: "Livreur assigne" },
  { status: "en_cours", label: "En livraison" },
  { status: "livree", label: "Livree" },
];

export default function OrderDetailScreen({ route }: OrderDetailScreenProps) {
  const { order } = route.params;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const statusConfig = STATUS_CONFIG[order.statut];
  const currentStepIndex = STEPS.findIndex((s) => s.status === order.statut);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCallDriver = () => {
    if (order.livreur?.user.telephone) {
      Linking.openURL(`tel:${order.livreur.user.telephone}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusCard, { backgroundColor: statusConfig.color + "15" }]}>
          <View style={[styles.statusIcon, { backgroundColor: statusConfig.color + "30" }]}>
            <Feather name={statusConfig.icon as any} size={24} color={statusConfig.color} />
          </View>
          <View style={styles.statusInfo}>
            <ThemedText type="h3" style={{ color: statusConfig.color }}>{statusConfig.label}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
              Commande #{order.id} - {formatDate(order.date_commande)}
            </ThemedText>
          </View>
        </View>

        {order.statut !== "annulee" && order.statut !== "livree" ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={{ marginBottom: Spacing.lg }}>Suivi de commande</ThemedText>
            <View style={styles.timeline}>
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <View key={step.status} style={styles.timelineItem}>
                    <View style={styles.timelineIndicator}>
                      <View style={[
                        styles.timelineDot,
                        { 
                          backgroundColor: isCompleted ? Colors.light.success : theme.backgroundSecondary,
                          borderColor: isCompleted ? Colors.light.success : theme.border,
                        },
                      ]}>
                        {isCompleted ? (
                          <Feather name="check" size={12} color="#FFFFFF" />
                        ) : null}
                      </View>
                      {index < STEPS.length - 1 ? (
                        <View style={[
                          styles.timelineLine,
                          { backgroundColor: index < currentStepIndex ? Colors.light.success : theme.border },
                        ]} />
                      ) : null}
                    </View>
                    <View style={[styles.timelineContent, { opacity: isCompleted ? 1 : 0.5 }]}>
                      <ThemedText type="body" style={{ fontWeight: isCurrent ? "700" : "400" }}>
                        {step.label}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Details de la commande</ThemedText>
          <View style={[styles.detailCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.productRow}>
              <View style={[styles.productIcon, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name="box" size={20} color={theme.textSecondary} />
              </View>
              <View style={styles.productInfo}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>{order.bouteille.nom_commercial}</ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {order.bouteille.marque} - {order.bouteille.type}
                </ThemedText>
              </View>
              <ThemedText type="body">x{order.quantite}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Livraison</ThemedText>
          <View style={[styles.detailCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.addressRow}>
              <View style={[styles.addressIcon, { backgroundColor: theme.primaryLight }]}>
                <Feather name="map-pin" size={18} color={theme.primary} />
              </View>
              <View style={styles.addressInfo}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>Adresse de livraison</ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {order.adresse_livraison}
                </ThemedText>
              </View>
            </View>

            {order.livreur ? (
              <>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.driverRow}>
                  <View style={[styles.driverAvatar, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="body" style={{ fontWeight: "600" }}>
                      {order.livreur.user.prenom[0]}{order.livreur.user.nom[0]}
                    </ThemedText>
                  </View>
                  <View style={styles.driverInfo}>
                    <ThemedText type="body" style={{ fontWeight: "600" }}>
                      {order.livreur.user.prenom} {order.livreur.user.nom}
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      Votre livreur - {order.livreur.vehicule}
                    </ThemedText>
                  </View>
                  <Pressable
                    style={[styles.callButton, { backgroundColor: Colors.light.success + "20" }]}
                    onPress={handleCallDriver}
                  >
                    <Feather name="phone" size={18} color={Colors.light.success} />
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Paiement</ThemedText>
          <View style={[styles.detailCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.paymentRow}>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>Sous-total</ThemedText>
              <ThemedText type="body">{order.prix_total.toLocaleString()} XAF</ThemedText>
            </View>
            <View style={styles.paymentRow}>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>Frais de livraison</ThemedText>
              <ThemedText type="body">{order.frais_livraison.toLocaleString()} XAF</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.paymentRow}>
              <ThemedText type="h3">Total</ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary }}>{order.montant_total.toLocaleString()} XAF</ThemedText>
            </View>
          </View>
        </View>

        {order.statut === "livree" ? (
          <Button style={{ marginTop: Spacing.lg }}>
            Commander a nouveau
          </Button>
        ) : null}
      </ScrollView>
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
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statusInfo: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  timeline: {
    paddingLeft: Spacing.sm,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 50,
  },
  timelineIndicator: {
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  detailCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  productRow: {
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
  productInfo: {
    flex: 1,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  driverInfo: {
    flex: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
});
