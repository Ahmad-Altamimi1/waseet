import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { RootStackParamList } from "../types";
import LanguageModal from "../components/LanguageModal";
import ConfirmationModal from "../components/ConfirmationModal";
import InfoModal from "../components/InfoModal";
import {
  getRTLStyle,
  getRTLIcon,
  getRTLTextAlign,
  getRTLFlexDirection,
} from "../utils/rtlUtils";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { state, actions } = useApp();
  const { t, changeLanguage, currentLanguage, isRTL } = useLanguage();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // RTL state
  const isRTLMode = I18nManager.isRTL;

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleLanguageChange = () => {
    setLanguageModalVisible(true);
  };

  const handleEditProfile = () => {
    setEditProfileModalVisible(true);
  };

  const handleNotifications = () => {
    setNotificationsModalVisible(true);
  };

  const handleHelpSupport = () => {
    setHelpModalVisible(true);
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <View style={getRTLStyle(styles.header, styles.rtlHeader)}>
        <Text style={[styles.title, { textAlign: getRTLTextAlign() }]}>
          {t("profile.title")}
        </Text>
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
            style={getRTLStyle(styles.menuItem, styles.rtlMenuItem)}
            onPress={handleEditProfile}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, { textAlign: getRTLTextAlign() }]}>
              {t("profile.edit_profile")}
            </Text>
            <Ionicons
              name={getRTLIcon("chevron-forward", "chevron-back")}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={getRTLStyle(styles.menuItem, styles.rtlMenuItem)}
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
            <Text style={[styles.menuText, { textAlign: getRTLTextAlign() }]}>
              {t("profile.order_history")}
            </Text>
            <Ionicons
              name={getRTLIcon("chevron-forward", "chevron-back")}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={getRTLStyle(styles.menuItem, styles.rtlMenuItem)}
            onPress={handleNotifications}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, { textAlign: getRTLTextAlign() }]}>
              {t("profile.notifications")}
            </Text>
            <Ionicons
              name={getRTLIcon("chevron-forward", "chevron-back")}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={getRTLStyle(styles.menuItem, styles.rtlMenuItem)}
            onPress={handleLanguageChange}
          >
            <Ionicons
              name="language-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, { textAlign: getRTLTextAlign() }]}>
              {t("profile.language")}
            </Text>
            <View
              style={getRTLStyle(styles.languageInfo, styles.rtlLanguageInfo)}
            >
              <Text
                style={[styles.languageText, { textAlign: getRTLTextAlign() }]}
              >
                {currentLanguage === "en"
                  ? t("profile.english")
                  : t("profile.arabic")}
              </Text>
              <Ionicons
                name={getRTLIcon("chevron-forward", "chevron-back")}
                size={20}
                color={theme.colors.neutral.gray400}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={getRTLStyle(styles.menuItem, styles.rtlMenuItem)}
            onPress={handleHelpSupport}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <Text style={[styles.menuText, { textAlign: getRTLTextAlign() }]}>
              {t("profile.help_support")}
            </Text>
            <Ionicons
              name={getRTLIcon("chevron-forward", "chevron-back")}
              size={20}
              color={theme.colors.neutral.gray400}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={getRTLStyle(styles.logoutButton, styles.rtlLogoutButton)}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.colors.status.error}
          />
          <Text style={[styles.logoutText, { textAlign: getRTLTextAlign() }]}>
            {t("profile.logout")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title={t("profile.logout")}
        message={t("profile.logout_message")}
        confirmText={t("profile.logout")}
        cancelText={t("common.cancel")}
        onConfirm={actions.logout}
        confirmStyle="danger"
        icon="log-out-outline"
      />

      {/* Edit Profile Info Modal */}
      <InfoModal
        visible={editProfileModalVisible}
        onClose={() => setEditProfileModalVisible(false)}
        title={t("profile.edit_profile")}
        message={t("profile.edit_profile_coming_soon")}
        type="info"
        icon="person-outline"
      />

      {/* Notifications Info Modal */}
      <InfoModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
        title={t("profile.notifications")}
        message={t("profile.notifications_coming_soon")}
        type="info"
        icon="notifications-outline"
      />

      {/* Help & Support Info Modal */}
      <InfoModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        title={t("profile.help_support")}
        message={t("profile.help_support_message")}
        type="info"
        icon="help-circle-outline"
      />
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
  rtlHeader: {
    alignItems: "flex-end",
  },
  rtlMenuItem: {
    flexDirection: "row-reverse",
  },
  rtlLanguageInfo: {
    flexDirection: "row-reverse",
  },
  rtlLogoutButton: {
    flexDirection: "row-reverse",
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
  rtlLanguageText: {
    marginRight: 0,
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;
