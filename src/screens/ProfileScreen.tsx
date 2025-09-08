import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";

const ProfileScreen: React.FC = () => {
  const { state, actions } = useApp();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: actions.logout, style: "destructive" },
    ]);
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {state.user?.name?.charAt(0) || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{state.user?.name || "User"}</Text>
          <Text style={styles.userEmail}>
            {state.user?.email || "user@example.com"}
          </Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="bag-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.menuText}>Order History</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.colors.status.error}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.accent.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.white,
  },
  userName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  menuSection: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.status.error,
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;
