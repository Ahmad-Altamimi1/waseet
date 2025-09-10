import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { RootStackParamList } from "../types";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { state, actions } = useApp();
  const { t, changeLanguage, currentLanguage, isRTL } = useLanguage();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(t("profile.logout"), t("profile.logout_message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        onPress: actions.logout,
        style: "destructive",
      },
    ]);
  };

  const handleLanguageChange = () => {
    Alert.alert(t("profile.select_language"), "", [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.english"),
        onPress: () => changeLanguage("en"),
        style: currentLanguage === "en" ? "destructive" : "default",
      },
      {
        text: t("profile.arabic"),
        onPress: () => changeLanguage("ar"),
        style: currentLanguage === "ar" ? "destructive" : "default",
      },
    ]);
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <View style={[styles.header, isRTL && styles.rtlContainer]}>
        <Text style={styles.title}>{t("profile.title")}</Text>
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
          <TouchableOpacity
            style={[styles.menuItem, isRTL && styles.rtlMenuItem]}
            onPress={() => {
              Alert.alert(
                t("profile.edit_profile"),
                t("profile.edit_profile_coming_soon")
              );
            }}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, isRTL && styles.rtlText]}>
              {t("profile.edit_profile")}
            </Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isRTL && styles.rtlMenuItem]}
            onPress={() => {
              // Navigate to Orders tab
              navigation.navigate("Main");
              // You could also use navigation.navigate("Main", { screen: "Orders" }) if needed
            }}
          >
            <Ionicons
              name="bag-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, isRTL && styles.rtlText]}>
              {t("profile.order_history")}
            </Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isRTL && styles.rtlMenuItem]}
            onPress={() => {
              Alert.alert(
                t("profile.notifications"),
                t("profile.notifications_coming_soon")
              );
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, isRTL && styles.rtlText]}>
              {t("profile.notifications")}
            </Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isRTL && styles.rtlMenuItem]}
            onPress={handleLanguageChange}
          >
            <Ionicons
              name="language-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, isRTL && styles.rtlText]}>
              {t("profile.language")}
            </Text>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageText, isRTL && styles.rtlText]}>
                {currentLanguage === "en"
                  ? t("profile.english")
                  : t("profile.arabic")}
              </Text>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={20}
                color={theme.colors.neutral.gray400}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isRTL && styles.rtlMenuItem]}
            onPress={() => {
              Alert.alert(
                t("profile.help_support"),
                t("profile.help_support_message"),
                [{ text: t("common.ok") }]
              );
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, isRTL && styles.rtlText]}>
              {t("profile.help_support")}
            </Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isRTL && styles.rtlMenuItem]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.colors.status.error}
          />
          <Text style={[styles.logoutText, isRTL && styles.rtlText]}>
            {t("profile.logout")}
          </Text>
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
  rtlContainer: {
    flexDirection: "row-reverse",
  },
  rtlMenuItem: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
});

export default ProfileScreen;
