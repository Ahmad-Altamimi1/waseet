import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { AddProductForm, RootStackParamList } from "../types";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Validation schema
const addProductSchema = yup.object().shape({
  link: yup
    .string()
    .url("Please enter a valid URL")
    .required("Product link is required"),
  price: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, "Please enter a valid price")
    .optional(),
  quantity: yup
    .string()
    .matches(/^\d+$/, "Please enter a valid quantity")
    .required("Quantity is required"),
  color: yup.string().optional(),
  size: yup.string().optional(),
}) as yup.ObjectSchema<AddProductForm>;

const HomeScreen: React.FC = () => {
  const { actions, state } = useApp();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddProductForm>({
    resolver: yupResolver(addProductSchema),
  });

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      formOpacity.value = withTiming(1, { duration: 300 });
      formTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      formOpacity.value = withTiming(0, { duration: 300 });
      formTranslateY.value = withTiming(50, { duration: 300 });
    }
  };

  const onSubmit = (data: AddProductForm) => {
    buttonScale.value = withSpring(0.95);

    actions.addProduct({
      link: data.link,
      price: parseFloat(data.price || "0"),
      quantity: parseInt(data.quantity),
      color: data.color || "",
      size: data.size || "",
    });

    buttonScale.value = withSpring(1);

    Alert.alert("Product Added!", "Your product has been added to the order.", [
      {
        text: "Add Another",
        onPress: () => reset(),
      },
      {
        text: "View Cart",
        onPress: () => {
          reset();
          setIsFormVisible(false);
          formOpacity.value = 0;
          formTranslateY.value = 50;
        },
      },
    ]);
  };

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {state.user?.name?.split(" ")[0] || "Beautiful"} ✨
            </Text>
            <Text style={styles.subtitle}>
              Ready to add something fabulous?
            </Text>
          </View>
          {state.isAdmin && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate("Admin")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.accent.lavender}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[
              theme.colors.accent.lavender,
              theme.colors.accent.deepLavender,
            ]}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Your Fashion Journey</Text>
              <Text style={styles.heroSubtitle}>
                Add products from your favorite stores and let us handle the
                rest
              </Text>
              <TouchableOpacity style={styles.heroButton} onPress={toggleForm}>
                <Text style={styles.heroButtonText}>
                  {isFormVisible ? "Hide Form" : "Add Product"}
                </Text>
                <Ionicons
                  name={isFormVisible ? "chevron-up" : "add-circle-outline"}
                  size={20}
                  color={theme.colors.accent.lavender}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.heroIcon}>
              <Ionicons
                name="bag-handle-outline"
                size={60}
                color="rgba(255,255,255,0.3)"
              />
            </View>
          </LinearGradient>
        </View>

        {/* Add Product Form */}
        {isFormVisible && (
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Text style={styles.formTitle}>Add New Product</Text>

              {/* Product Link */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Product Link</Text>
                <Controller
                  control={control}
                  name="link"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="link-outline"
                        size={20}
                        color={theme.colors.neutral.gray500}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.textInput,
                          errors.link && styles.inputError,
                        ]}
                        placeholder="https://shein.com/product-url"
                        placeholderTextColor={theme.colors.neutral.gray400}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                      />
                    </View>
                  )}
                />
                {errors.link && (
                  <Text style={styles.errorText}>{errors.link.message}</Text>
                )}
              </View>

              {/* Price and Quantity Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Price ($)</Text>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="pricetag-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.price && styles.inputError,
                          ]}
                          placeholder="29.99"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    )}
                  />
                  {errors.price && (
                    <Text style={styles.errorText}>{errors.price.message}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="layers-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.quantity && styles.inputError,
                          ]}
                          placeholder="1"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="number-pad"
                        />
                      </View>
                    )}
                  />
                  {errors.quantity && (
                    <Text style={styles.errorText}>
                      {errors.quantity.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* Color and Size Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Color</Text>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="color-palette-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.color && styles.inputError,
                          ]}
                          placeholder="Blush Pink"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                        />
                      </View>
                    )}
                  />
                  {errors.color && (
                    <Text style={styles.errorText}>{errors.color.message}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Size</Text>
                  <Controller
                    control={control}
                    name="size"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="resize-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.size && styles.inputError,
                          ]}
                          placeholder="M"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="characters"
                        />
                      </View>
                    )}
                  />
                  {errors.size && (
                    <Text style={styles.errorText}>{errors.size.message}</Text>
                  )}
                </View>
              </View>

              {/* Add to Order Button */}
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleSubmit(onSubmit)}
                >
                  <LinearGradient
                    colors={[
                      theme.colors.accent.gold,
                      theme.colors.accent.lightGold,
                    ]}
                    style={styles.addButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={theme.colors.text.white}
                    />
                    <Text style={styles.addButtonText}>Add to Order</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
          </Animated.View>
        )}

        {/* Current Order Summary */}
        {state.currentOrder.length > 0 && (
          <View style={styles.orderSummary}>
            <Text style={styles.orderSummaryTitle}>Current Order</Text>
            <Text style={styles.orderSummaryText}>
              {state.currentOrder.length} item
              {state.currentOrder.length !== 1 ? "s" : ""} in your cart
            </Text>
            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={() => navigation.navigate("OrderSummary")}
            >
              <Text style={styles.viewCartButtonText}>View Cart</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.accent.lavender}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.tipText}>
              Copy product links directly from Shein or other stores
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.tipText}>
              Double-check sizes and colors before adding
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.accent.lavender}
            />
            <Text style={styles.tipText}>Track your orders in real-time</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  adminButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  heroSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  heroCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.lg,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.white,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: "rgba(255,255,255,0.9)",
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: theme.colors.accent.lavender,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.base,
  },
  heroIcon: {
    marginLeft: theme.spacing.md,
  },
  formContainer: {
    backgroundColor: theme.colors.primary.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  formTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
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
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  addButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  orderSummary: {
    backgroundColor: theme.colors.primary.beige,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  orderSummaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  orderSummaryText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewCartButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.accent.lavender,
    marginRight: theme.spacing.xs,
  },
  tipsSection: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  tipsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});

export default HomeScreen;
