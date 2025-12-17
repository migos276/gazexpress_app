import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type OrderSuccessScreenProps = NativeStackScreenProps<ClientStackParamList, "OrderSuccess">;

export default function OrderSuccessScreen({ navigation }: OrderSuccessScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacity.value = withDelay(300, withSpring(1));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xxxl, paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.centerContent}>
          <Animated.View style={[styles.iconContainer, { backgroundColor: Colors.light.success + "20" }, iconStyle]}>
            <Feather name="check" size={60} color={Colors.light.success} />
          </Animated.View>

          <Animated.View style={[styles.textContent, contentStyle]}>
            <ThemedText type="h1" style={{ textAlign: "center" }}>
              Commande confirmee
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.md }}>
              Votre commande a ete passee avec succes. Vous recevrez une notification lorsque votre livreur sera en route.
            </ThemedText>

            <View style={[styles.orderCard, { backgroundColor: theme.backgroundDefault, marginTop: Spacing.xl }]}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Numero de commande</ThemedText>
              <ThemedText type="h2" style={{ marginTop: Spacing.xs }}>#{orderNumber}</ThemedText>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault, marginTop: Spacing.lg }]}>
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: theme.primaryLight }]}>
                  <Feather name="clock" size={18} color={theme.primary} />
                </View>
                <View style={styles.infoText}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>Delai estime</ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>30-45 minutes</ThemedText>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: theme.primaryLight }]}>
                  <Feather name="bell" size={18} color={theme.primary} />
                </View>
                <View style={styles.infoText}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>Notifications</ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>Vous serez informe de chaque etape</ThemedText>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          <Button onPress={() => navigation.navigate("Orders")} style={styles.trackButton}>
            Suivre ma commande
          </Button>
          <Button 
            onPress={() => navigation.navigate("ClientHome")} 
            style={[styles.homeButton, { backgroundColor: theme.backgroundSecondary }]}
          >
            <ThemedText style={{ color: theme.text }}>Retour a l'accueil</ThemedText>
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  textContent: {
    width: "100%",
    alignItems: "center",
  },
  orderCard: {
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  infoCard: {
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  actions: {
    gap: Spacing.md,
  },
  trackButton: {
    width: "100%",
  },
  homeButton: {
    width: "100%",
  },
});
