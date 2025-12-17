import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Zone } from "@/types";
import { ClientStackParamList } from "@/navigation/ClientStackNavigator";

type SelectAddressScreenProps = NativeStackScreenProps<ClientStackParamList, "SelectAddress">;

const MOCK_ZONES: Zone[] = [
  { id: 1, nom: "Bastos", frais_livraison: 1500, delai_estime: "30-45 min", is_active: true },
  { id: 2, nom: "Melen", frais_livraison: 1000, delai_estime: "20-30 min", is_active: true },
  { id: 3, nom: "Essos", frais_livraison: 1200, delai_estime: "25-40 min", is_active: true },
  { id: 4, nom: "Omnisport", frais_livraison: 1800, delai_estime: "40-55 min", is_active: true },
  { id: 5, nom: "Nlongkak", frais_livraison: 1300, delai_estime: "30-45 min", is_active: true },
];

export default function SelectAddressScreen({ navigation }: SelectAddressScreenProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { selectedZone, setDeliveryZone, deliveryAddress, setDeliveryAddress } = useCart();
  
  const [localAddress, setLocalAddress] = useState(deliveryAddress);
  const [localZone, setLocalZone] = useState<Zone | null>(selectedZone);

  const handleConfirm = () => {
    if (localZone) {
      setDeliveryZone(localZone);
      setDeliveryAddress(localAddress);
      navigation.goBack();
    }
  };

  const renderZone = ({ item }: { item: Zone }) => (
    <Pressable
      style={[
        styles.zoneCard,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: localZone?.id === item.id ? theme.primary : theme.border,
          borderWidth: localZone?.id === item.id ? 2 : 1,
        },
      ]}
      onPress={() => setLocalZone(item)}
    >
      <View style={styles.zoneInfo}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>{item.nom}</ThemedText>
        <View style={styles.zoneDetails}>
          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
              {item.delai_estime}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.zonePricing}>
        <ThemedText type="body" style={{ color: theme.primary, fontWeight: "700" }}>
          {item.frais_livraison.toLocaleString()} XAF
        </ThemedText>
        {localZone?.id === item.id ? (
          <Feather name="check-circle" size={20} color={theme.primary} />
        ) : (
          <View style={[styles.radioOuter, { borderColor: theme.border }]} />
        )}
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Adresse de livraison</ThemedText>
          <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
            <Feather name="map-pin" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Entrez votre adresse complete"
              placeholderTextColor={theme.textSecondary}
              value={localAddress}
              onChangeText={setLocalAddress}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>Zone de livraison</ThemedText>
          <FlatList
            data={MOCK_ZONES}
            renderItem={renderZone}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          />
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, paddingBottom: insets.bottom + Spacing.md }]}>
        <Button onPress={handleConfirm} disabled={!localZone} style={styles.confirmButton}>
          Confirmer l'adresse
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 80,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  zoneCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneDetails: {
    marginTop: Spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  zonePricing: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
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
});
