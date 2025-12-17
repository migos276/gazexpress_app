import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { User, UserRole } from "@/types";
import { AdminDrawerParamList } from "@/navigation/AdminDrawerNavigator";

type AdminUsersScreenProps = {
  navigation: DrawerNavigationProp<AdminDrawerParamList, "Users">;
};

const MOCK_USERS: User[] = [
  { id: "1", email: "paul@test.com", nom: "Mbarga", prenom: "Paul", telephone: "+237699123456", role: "client", is_active: true, date_creation: "2024-01-15" },
  { id: "2", email: "marie@test.com", nom: "Nkolo", prenom: "Marie", telephone: "+237677654321", role: "client", is_active: true, date_creation: "2024-02-20" },
  { id: "3", email: "jean@test.com", nom: "Onana", prenom: "Jean", telephone: "+237699111111", role: "livreur", is_active: true, date_creation: "2024-01-10" },
  { id: "4", email: "pierre@test.com", nom: "Kamga", prenom: "Pierre", telephone: "+237677222222", role: "livreur", is_active: false, date_creation: "2024-03-05" },
  { id: "5", email: "station@test.com", nom: "Total Bastos", prenom: "Station", telephone: "+237699333333", role: "station", is_active: true, date_creation: "2024-01-01" },
];

const roleConfig: Record<UserRole, { color: string; label: string; icon: string }> = {
  client: { color: Colors.light.roleClient, label: "Client", icon: "user" },
  livreur: { color: Colors.light.roleLivreur, label: "Livreur", icon: "truck" },
  station: { color: Colors.light.roleStation, label: "Station", icon: "home" },
  admin: { color: Colors.light.roleAdmin, label: "Admin", icon: "shield" },
};

export default function AdminUsersScreen({ navigation }: AdminUsersScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [users] = useState(MOCK_USERS);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const renderUser = ({ item }: { item: User }) => {
    const config = roleConfig[item.role];
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.userCard,
          { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: config.color + "20" }]}>
          <ThemedText type="body" style={{ color: config.color, fontWeight: "700" }}>
            {item.prenom[0]}{item.nom[0]}
          </ThemedText>
        </View>
        <View style={styles.userInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {item.prenom} {item.nom}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>{item.email}</ThemedText>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: config.color + "20" }]}>
              <Feather name={config.icon as any} size={10} color={config.color} />
              <ThemedText type="caption" style={{ color: config.color, fontWeight: "600", marginLeft: 2 }}>
                {config.label}
              </ThemedText>
            </View>
            <View style={[styles.statusDot, { backgroundColor: item.is_active ? Colors.light.success : Colors.light.error }]} />
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                <Feather name="menu" size={24} color={theme.text} />
              </Pressable>
              <ThemedText type="h1">Utilisateurs</ThemedText>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
              <Feather name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Rechercher..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.filters}>
              {(["all", "client", "livreur", "station"] as const).map((role) => (
                <Pressable
                  key={role}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedRole === role ? theme.primary : theme.backgroundDefault,
                      borderColor: selectedRole === role ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <ThemedText
                    type="caption"
                    style={{ color: selectedRole === role ? "#FFFFFF" : theme.text, fontWeight: "600" }}
                  >
                    {role === "all" ? "Tous" : roleConfig[role].label + "s"}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filters: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
