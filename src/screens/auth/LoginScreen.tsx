import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import InfoModal from "../../components/InfoModal";
import { LoginForm } from "../../types";
import { getRTLStyle, getRTLIcon, getRTLTextAlign, getRTLFlexDirection } from "../../utils/rtlUtils";

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { actions, state } = useApp();
  const { t, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // RTL state
  const isRTLMode = I18nManager.isRTL;

  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "sophia@example.com", // Pre-fill for demo
      password: "password123",
    },
  });

  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const onSubmit = async (data: LoginForm) => {
    buttonScale.value = withSpring(0.95);

    const success = await actions.login(data.email, data.password);

    buttonScale.value = withSpring(1);

    if (!success) {
      setErrorModalVisible(true);
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={getRTLStyle(styles.header, styles.rtlHeader)}>
            <Text style={[styles.welcomeText, { textAlign: getRTLTextAlign() }]}>
              {t("auth.welcome_to")}
            </Text>
            <Text style={[styles.brandText, { textAlign: getRTLTextAlign() }]}>
              {t("auth.aura")}
            </Text>
            <Text style={[styles.subtitleText, { textAlign: getRTLTextAlign() }]}>
              {t("auth.sign_in_subtitle")}
            </Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { textAlign: getRTLTextAlign() }]}>
                {t("auth.email")}
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={getRTLStyle(styles.inputWrapper, styles.rtlInputWrapper)}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={getRTLStyle(styles.inputIcon, styles.rtlInputIcon)}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.email && styles.inputError,
                        { textAlign: getRTLTextAlign() },
                      ]}
                      placeholder={t("auth.enter_email")}
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textAlign={getRTLTextAlign()}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={[styles.errorText, { textAlign: getRTLTextAlign() }]}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { textAlign: getRTLTextAlign() }]}>
                {t("auth.password")}
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={getRTLStyle(styles.inputWrapper, styles.rtlInputWrapper)}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={getRTLStyle(styles.inputIcon, styles.rtlInputIcon)}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                        { textAlign: getRTLTextAlign() },
                      ]}
                      placeholder={t("auth.enter_password")}
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textAlign={getRTLTextAlign()}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={theme.colors.neutral.gray500}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={[styles.errorText, { textAlign: getRTLTextAlign() }]}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Login Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit(onSubmit)}
                disabled={state.isLoading}
              >
                <LinearGradient
                  colors={[
                    theme.colors.accent.lavender,
                    theme.colors.accent.deepLavender,
                  ]}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {state.isLoading ? (
                    <ActivityIndicator
                      color={theme.colors.text.white}
                      size="small"
                    />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>User: sophia@example.com</Text>
              <Text style={styles.demoText}>Admin: admin@aura.com</Text>
              <Text style={styles.demoText}>Password: any password</Text>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Modal */}
      <InfoModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title={t("auth.login_failed")}
        message={t("auth.login_failed_message")}
        type="error"
        icon="alert-circle-outline"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing["2xl"],
  },
  welcomeText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.normal,
  },
  brandText: {
    fontSize: theme.typography.sizes["4xl"],
    color: theme.colors.accent.lavender,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 2,
    marginVertical: theme.spacing.sm,
  },
  subtitleText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.light,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  formContainer: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  inputIcon: {
    marginLeft: theme.spacing.md,
  },
  textInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  passwordInput: {
    paddingRight: theme.spacing.sm,
  },
  passwordToggle: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  loginButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  demoContainer: {
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  demoTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  demoText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  signupText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  signupLink: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.accent.lavender,
    fontWeight: theme.typography.weights.semibold,
  },
  // RTL Styles
  rtlHeader: {
    alignItems: "flex-end",
  },
  rtlInputWrapper: {
    flexDirection: "row-reverse",
  },
  rtlInputIcon: {
    marginLeft: 0,
    marginRight: theme.spacing.md,
  },
  rtlButtonContainer: {
    flexDirection: "row-reverse",
  },
  rtlSignupContainer: {
    flexDirection: "row-reverse",
  },
});

export default LoginScreen;
