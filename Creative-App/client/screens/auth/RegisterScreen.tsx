import React, { useState } from "react";
import { View, StyleSheet, TextInput, ActivityIndicator, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { UserRole } from "@/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
  { value: "client", label: "Client", icon: "shopping-bag", description: "Commander du gaz" },
  { value: "livreur", label: "Livreur", icon: "truck", description: "Effectuer des livraisons" },
  { value: "station", label: "Station", icon: "home", description: "Vendre du gaz" },
];

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { register, isLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (!nom || !prenom || !email || !telephone || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setError("");
      await register({
        email,
        password,
        nom,
        prenom,
        telephone,
        role: selectedRole,
      });
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="h1">Creer un compte</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
            {step === 1 ? "Choisissez votre profil" : "Completez vos informations"}
          </ThemedText>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
          <View style={[styles.progressStep, { backgroundColor: step >= 2 ? theme.primary : theme.border }]} />
        </View>

        {step === 1 ? (
          <View style={styles.roleSelection}>
            {roles.map((role) => (
              <Pressable
                key={role.value}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: theme.backgroundDefault,
                    borderColor: selectedRole === role.value ? theme.primary : theme.border,
                    borderWidth: selectedRole === role.value ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedRole(role.value)}
              >
                <View style={[styles.roleIcon, { backgroundColor: theme.primaryLight }]}>
                  <Feather name={role.icon as any} size={24} color={theme.primary} />
                </View>
                <View style={styles.roleInfo}>
                  <ThemedText type="h3">{role.label}</ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                    {role.description}
                  </ThemedText>
                </View>
                {selectedRole === role.value ? (
                  <Feather name="check-circle" size={24} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                  Prenom
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Jean"
                    placeholderTextColor={theme.textSecondary}
                    value={prenom}
                    onChangeText={setPrenom}
                  />
                </View>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                  Nom
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Dupont"
                    placeholderTextColor={theme.textSecondary}
                    value={nom}
                    onChangeText={setNom}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Email
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <Feather name="mail" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="votre@email.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Telephone
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <Feather name="phone" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="+237 6XX XXX XXX"
                  placeholderTextColor={theme.textSecondary}
                  value={telephone}
                  onChangeText={setTelephone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Mot de passe
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Min. 8 caracteres"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                Confirmer le mot de passe
              </ThemedText>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.backgroundDefault }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirmer votre mot de passe"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {error ? (
              <ThemedText type="caption" style={[styles.error, { color: theme.error }]}>
                {error}
              </ThemedText>
            ) : null}
          </View>
        )}

        <View style={styles.actions}>
          {step === 2 ? (
            <Button 
              onPress={() => setStep(1)} 
              style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <ThemedText style={{ color: theme.text }}>Retour</ThemedText>
            </Button>
          ) : null}
          <Button onPress={handleNext} disabled={isLoading} style={styles.nextButton}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : step === 1 ? (
              "Continuer"
            ) : (
              "S'inscrire"
            )}
          </Button>
        </View>

        <View style={styles.footer}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Deja un compte ?{" "}
          </ThemedText>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <ThemedText type="body" style={{ color: theme.link, fontWeight: "600" }}>
              Se connecter
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  roleSelection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  roleInfo: {
    flex: 1,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
  },
  error: {
    marginTop: Spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
