import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
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
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { StationStackParamList } from "@/navigation/StationTabNavigator";

type AddBouteilleScreenProps = NativeStackScreenProps<StationStackParamList, "AddBouteille">;

const types = ["6kg", "12kg", "15kg", "autre"];

export default function AddBouteilleScreen({ navigation }: AddBouteilleScreenProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const [nomCommercial, setNomCommercial] = useState("");
  const [selectedType, setSelectedType] = useState("12kg");
  const [marque, setMarque] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!nomCommercial || !marque || !prix || !stock) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Succes", "Bouteille ajoutee avec succes", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Pressable style={[styles.imagePicker, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <View style={[styles.imageIcon, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="camera" size={24} color={theme.textSecondary} />
          </View>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            Ajouter une photo
          </ThemedText>
        </Pressable>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              Nom commercial *
            </ThemedText>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: Gaz Total Premium 12kg"
                placeholderTextColor={theme.textSecondary}
                value={nomCommercial}
                onChangeText={setNomCommercial}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              Type de bouteille *
            </ThemedText>
            <View style={styles.typeContainer}>
              {types.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: selectedType === type ? theme.primary : theme.backgroundDefault,
                      borderColor: selectedType === type ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <ThemedText
                    type="caption"
                    style={{ color: selectedType === type ? "#FFFFFF" : theme.text, fontWeight: "600" }}
                  >
                    {type}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              Marque / Fournisseur *
            </ThemedText>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: Total, Afrigas, Tradex"
                placeholderTextColor={theme.textSecondary}
                value={marque}
                onChangeText={setMarque}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Prix (XAF) *
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="6500"
                  placeholderTextColor={theme.textSecondary}
                  value={prix}
                  onChangeText={setPrix}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Stock *
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="25"
                  placeholderTextColor={theme.textSecondary}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              Description (optionnel)
            </ThemedText>
            <View style={[styles.textAreaWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
              <TextInput
                style={[styles.textArea, { color: theme.text }]}
                placeholder="Description de la bouteille..."
                placeholderTextColor={theme.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, paddingBottom: insets.bottom + Spacing.md }]}>
        <Button onPress={handleSave} disabled={isLoading} style={styles.saveButton}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            "Enregistrer"
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
  imagePicker: {
    height: 150,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  imageIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {},
  label: {
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  typeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  textAreaWrapper: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  textArea: {
    fontSize: 14,
    minHeight: 80,
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
  saveButton: {
    width: "100%",
  },
});
