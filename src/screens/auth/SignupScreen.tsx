import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
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
import { SignupForm } from "../../types";

// Validation schema
const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { actions, state } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
  });

  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const onSubmit = async (data: SignupForm) => {
    buttonScale.value = withSpring(0.95);

    // For demo purposes, we'll just simulate a signup and login
    const success = await actions.login(data.email, data.password);

    buttonScale.value = withSpring(1);

    if (!success) {
      Alert.alert("Signup Failed", "Something went wrong. Please try again.");
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
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Join</Text>
            <Text style={styles.brandText}>Aura</Text>
            <Text style={styles.subtitleText}>
              Create your account to start shopping
            </Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.name && styles.inputError,
                      ]}
                      placeholder="Enter your full name"
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.email && styles.inputError,
                      ]}
                      placeholder="Enter your email"
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                      ]}
                      placeholder="Enter your password"
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
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
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.colors.neutral.gray500}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        styles.passwordInput,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      placeholder="Confirm your password"
                      placeholderTextColor={theme.colors.neutral.gray400}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color={theme.colors.neutral.gray500}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Signup Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSubmit(onSubmit)}
                disabled={state.isLoading}
              >
                <LinearGradient
                  colors={[
                    theme.colors.accent.lavender,
                    theme.colors.accent.deepLavender,
                  ]}
                  style={styles.signupButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {state.isLoading ? (
                    <ActivityIndicator
                      color={theme.colors.text.white}
                      size="small"
                    />
                  ) : (
                    <Text style={styles.signupButtonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: theme.spacing.md,
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
  signupButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  signupButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.accent.lavender,
    fontWeight: theme.typography.weights.semibold,
  },
});

export default SignupScreen;
