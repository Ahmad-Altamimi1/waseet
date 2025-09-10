import React, { useState, useMemo, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  Image,
  Alert,
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
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";

import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { AddProductForm, RootStackParamList } from "../types";
import SuccessModal from "../components/SuccessModal";
import {
  getRTLStyle,
  getRTLIcon,
  getRTLTextAlign,
  getRTLFlexDirection,
} from "../utils/rtlUtils";
import {
  extractProductUrl,
  validateProductUrl,
  getPlatformName,
} from "../utils/urlUtils";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = memo(() => {
  const { actions, state } = useApp();
  const { t, isRTL } = useLanguage();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showImageUploadSuccess, setShowImageUploadSuccess] = useState(false);
  const [extractedUrl, setExtractedUrl] = useState<string>("");
  const [urlValidationError, setUrlValidationError] = useState<string>("");
  const [detectedPlatform, setDetectedPlatform] = useState<string>("");

  // RTL state
  const isRTLMode = useMemo(() => I18nManager.isRTL, []);

  // Validation schema - memoized for performance
  const addProductSchema = useMemo(
    () =>
      yup.object().shape({
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
        image: yup.string().optional(),
      }) as yup.ObjectSchema<AddProductForm>,
    []
  );

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

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedImage(result.assets[0].uri);
        setShowImageUploadSuccess(true);

        // Hide success animation after 2 seconds
        setTimeout(() => {
          setShowImageUploadSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedImage(result.assets[0].uri);
        setShowImageUploadSuccess(true);

        // Hide success animation after 2 seconds
        setTimeout(() => {
          setShowImageUploadSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.log("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  }, []);

  const removeImage = useCallback(() => {
    setUploadedImage(null);
  }, []);

  const handleUrlChange = useCallback((text: string) => {
    // Clear previous validation errors
    setUrlValidationError("");
    setExtractedUrl("");
    setDetectedPlatform("");

    if (text.trim()) {
      const urlInfo = extractProductUrl(text);

      if (urlInfo.isValid) {
        setExtractedUrl(urlInfo.extractedUrl);
        setDetectedPlatform(urlInfo.platform);
        setUrlValidationError("");
      } else {
        setUrlValidationError(urlInfo.error || "Invalid URL format");
        setExtractedUrl("");
        setDetectedPlatform("");
      }
    }
  }, []);

  const onSubmit = useCallback(
    (data: AddProductForm) => {
      // Validate URL before submission
      if (!extractedUrl) {
        setUrlValidationError("Please enter a valid product URL");
        return;
      }

      buttonScale.value = withSpring(0.95);

      actions.addProduct({
        link: extractedUrl, // Use extracted URL instead of raw input
        price: parseFloat(data.price || "0"),
        quantity: parseInt(data.quantity),
        color: data.color || "",
        size: data.size || "",
        image: uploadedImage || undefined,
      });

      buttonScale.value = withSpring(1);

      // Reset form and image
      reset();
      setUploadedImage(null);
      setExtractedUrl("");
      setDetectedPlatform("");
      setUrlValidationError("");
      setIsFormVisible(false);

      setSuccessModalVisible(true);
    },
    [extractedUrl, uploadedImage, actions, reset, buttonScale]
  );

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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={undefined}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={getRTLStyle(styles.header, styles.rtlHeader)}>
          <View
            style={getRTLStyle(styles.headerContent, styles.rtlHeaderContent)}
          >
            <Text style={[styles.greeting, { textAlign: getRTLTextAlign() }]}>
              {t("home.hello", {
                name: state.user?.name?.split(" ")[0] || "Beautiful",
              })}
            </Text>
            <Text style={[styles.subtitle, { textAlign: getRTLTextAlign() }]}>
              {t("home.ready_to_add")}
            </Text>
          </View>
          {state.isAdmin && (
            <TouchableOpacity
              style={getRTLStyle(styles.adminButton, styles.rtlAdminButton)}
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
              <Text
                style={[styles.formTitle, { textAlign: getRTLTextAlign() }]}
              >
                {t("home.add_new_product")}
              </Text>

              {/* Product Link */}
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputLabel, { textAlign: getRTLTextAlign() }]}
                >
                  {t("home.product_link")}
                </Text>
                <Controller
                  control={control}
                  name="link"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={getRTLStyle(
                        styles.inputWrapper,
                        styles.rtlInputWrapper
                      )}
                    >
                      <Ionicons
                        name="link-outline"
                        size={20}
                        color={theme.colors.neutral.gray500}
                        style={getRTLStyle(
                          styles.inputIcon,
                          styles.rtlInputIcon
                        )}
                      />
                      <TextInput
                        style={[
                          styles.textInput,
                          (errors.link || urlValidationError) &&
                            styles.inputError,
                          { textAlign: getRTLTextAlign() },
                        ]}
                        placeholder={t("home.link_placeholder")}
                        placeholderTextColor={theme.colors.neutral.gray400}
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          handleUrlChange(text);
                        }}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        textAlign={getRTLTextAlign()}
                        multiline={true}
                        numberOfLines={2}
                      />
                    </View>
                  )}
                />

                {/* URL Extraction Status */}
                {extractedUrl && (
                  <View style={styles.urlExtractionStatus}>
                    <View style={styles.urlExtractionHeader}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.colors.status.success}
                      />
                      <Text
                        style={[
                          styles.urlExtractionText,
                          { textAlign: getRTLTextAlign() },
                        ]}
                      >
                        {t("home.url_extracted")} (
                        {detectedPlatform.toUpperCase()})
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.extractedUrlText,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {extractedUrl}
                    </Text>
                  </View>
                )}

                {(errors.link || urlValidationError) && (
                  <Text
                    style={[styles.errorText, { textAlign: getRTLTextAlign() }]}
                  >
                    {urlValidationError || errors.link?.message}
                  </Text>
                )}
              </View>

              {/* Price and Quantity Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text
                    style={[
                      styles.inputLabel,
                      { textAlign: getRTLTextAlign() },
                    ]}
                  >
                    {t("home.price")} ($)
                  </Text>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={getRTLStyle(
                          styles.inputWrapper,
                          styles.rtlInputWrapper
                        )}
                      >
                        <Ionicons
                          name="pricetag-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={getRTLStyle(
                            styles.inputIcon,
                            styles.rtlInputIcon
                          )}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.price && styles.inputError,
                            { textAlign: getRTLTextAlign() },
                          ]}
                          placeholder="29.99"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="decimal-pad"
                          textAlign={getRTLTextAlign()}
                        />
                      </View>
                    )}
                  />
                  {errors.price && (
                    <Text
                      style={[
                        styles.errorText,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {errors.price.message}
                    </Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text
                    style={[
                      styles.inputLabel,
                      { textAlign: getRTLTextAlign() },
                    ]}
                  >
                    {t("home.quantity")}
                  </Text>
                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={getRTLStyle(
                          styles.inputWrapper,
                          styles.rtlInputWrapper
                        )}
                      >
                        <Ionicons
                          name="layers-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={getRTLStyle(
                            styles.inputIcon,
                            styles.rtlInputIcon
                          )}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.quantity && styles.inputError,
                            { textAlign: getRTLTextAlign() },
                          ]}
                          placeholder="1"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="number-pad"
                          textAlign={getRTLTextAlign()}
                        />
                      </View>
                    )}
                  />
                  {errors.quantity && (
                    <Text
                      style={[
                        styles.errorText,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {errors.quantity.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* Color and Size Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text
                    style={[
                      styles.inputLabel,
                      { textAlign: getRTLTextAlign() },
                    ]}
                  >
                    {t("home.color")}
                  </Text>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={getRTLStyle(
                          styles.inputWrapper,
                          styles.rtlInputWrapper
                        )}
                      >
                        <Ionicons
                          name="color-palette-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={getRTLStyle(
                            styles.inputIcon,
                            styles.rtlInputIcon
                          )}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.color && styles.inputError,
                            { textAlign: getRTLTextAlign() },
                          ]}
                          placeholder="Blush Pink"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          textAlign={getRTLTextAlign()}
                        />
                      </View>
                    )}
                  />
                  {errors.color && (
                    <Text
                      style={[
                        styles.errorText,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {errors.color.message}
                    </Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text
                    style={[
                      styles.inputLabel,
                      { textAlign: getRTLTextAlign() },
                    ]}
                  >
                    {t("home.size")}
                  </Text>
                  <Controller
                    control={control}
                    name="size"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={getRTLStyle(
                          styles.inputWrapper,
                          styles.rtlInputWrapper
                        )}
                      >
                        <Ionicons
                          name="resize-outline"
                          size={20}
                          color={theme.colors.neutral.gray500}
                          style={getRTLStyle(
                            styles.inputIcon,
                            styles.rtlInputIcon
                          )}
                        />
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.size && styles.inputError,
                            { textAlign: getRTLTextAlign() },
                          ]}
                          placeholder="M"
                          placeholderTextColor={theme.colors.neutral.gray400}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="characters"
                          textAlign={getRTLTextAlign()}
                        />
                      </View>
                    )}
                  />
                  {errors.size && (
                    <Text
                      style={[
                        styles.errorText,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {errors.size.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* Image Upload Section */}
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputLabel, { textAlign: getRTLTextAlign() }]}
                >
                  {t("home.product_image")}
                </Text>

                {/* Image Purpose Explanation */}
                <View style={styles.imagePurposeContainer}>
                  <View style={styles.imagePurposeHeader}>
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={theme.colors.accent.lavender}
                    />
                    <Text
                      style={[
                        styles.imagePurposeTitle,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {t("home.image_purpose_title")}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.imagePurposeText,
                      { textAlign: getRTLTextAlign() },
                    ]}
                  >
                    {t("home.image_purpose_description")}
                  </Text>

                  {/* Image Guidelines */}
                  <View style={styles.imageGuidelines}>
                    <Text
                      style={[
                        styles.guidelinesTitle,
                        { textAlign: getRTLTextAlign() },
                      ]}
                    >
                      {t("home.image_guidelines")}:
                    </Text>
                    <View style={styles.guidelinesList}>
                      <View
                        style={getRTLStyle(
                          styles.guidelineItem,
                          styles.rtlGuidelineItem
                        )}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.colors.status.success}
                        />
                        <Text
                          style={[
                            styles.guidelineText,
                            { textAlign: getRTLTextAlign() },
                          ]}
                        >
                          {t("home.guideline_color")}
                        </Text>
                      </View>
                      <View
                        style={getRTLStyle(
                          styles.guidelineItem,
                          styles.rtlGuidelineItem
                        )}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.colors.status.success}
                        />
                        <Text
                          style={[
                            styles.guidelineText,
                            { textAlign: getRTLTextAlign() },
                          ]}
                        >
                          {t("home.guideline_size")}
                        </Text>
                      </View>
                      <View
                        style={getRTLStyle(
                          styles.guidelineItem,
                          styles.rtlGuidelineItem
                        )}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.colors.status.success}
                        />
                        <Text
                          style={[
                            styles.guidelineText,
                            { textAlign: getRTLTextAlign() },
                          ]}
                        >
                          {t("home.guideline_design")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {uploadedImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: uploadedImage }}
                      style={styles.imagePreview}
                    />
                    <View style={styles.imagePreviewOverlay}>
                      <Text style={styles.imagePreviewLabel}>
                        {t("home.selected_product_details")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={removeImage}
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={theme.colors.status.error}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.replaceImageButton}
                      onPress={pickImage}
                    >
                      <Ionicons
                        name="refresh"
                        size={20}
                        color={theme.colors.accent.lavender}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imageUploadContainer}>
                    <TouchableOpacity
                      style={styles.imageUploadButton}
                      onPress={pickImage}
                    >
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color={theme.colors.accent.lavender}
                      />
                      <Text style={styles.imageUploadText}>
                        {t("home.choose_from_gallery")}
                      </Text>
                      <Text style={styles.imageUploadSubtext}>
                        {t("home.show_product_details")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.imageUploadButton}
                      onPress={takePhoto}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={32}
                        color={theme.colors.accent.lavender}
                      />
                      <Text style={styles.imageUploadText}>
                        {t("home.take_photo")}
                      </Text>
                      <Text style={styles.imageUploadSubtext}>
                        {t("home.capture_product_details")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Image Upload Success Animation */}
                {showImageUploadSuccess && (
                  <View style={styles.uploadSuccessContainer}>
                    <LottieView
                      source={require("../assets/animations/splash.json")}
                      autoPlay
                      loop={false}
                      style={styles.uploadSuccessAnimation}
                    />
                    <Text style={styles.uploadSuccessText}>
                      {t("home.image_uploaded_successfully")}
                    </Text>
                  </View>
                )}
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

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={t("home.product_added")}
        message={t("home.product_added_message")}
        primaryButtonText={t("home.view_cart")}
        secondaryButtonText={t("home.add_another")}
        onPrimaryPress={() => {
          reset();
          setIsFormVisible(false);
          formOpacity.value = 0;
          formTranslateY.value = 50;
          navigation.navigate("Main");
        }}
        onSecondaryPress={() => {
          reset();
        }}
      />
    </LinearGradient>
  );
});

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
  headerContent: {
    flex: 1,
  },
  // RTL Styles
  rtlHeader: {
    flexDirection: "row-reverse",
  },
  rtlHeaderContent: {
    alignItems: "flex-end",
  },
  rtlAdminButton: {
    marginLeft: 0,
    marginRight: theme.spacing.md,
  },
  rtlFormContainer: {
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
  rtlTipContainer: {
    flexDirection: "row-reverse",
  },
  rtlTipText: {
    marginLeft: 0,
    marginRight: theme.spacing.sm,
    textAlign: "right",
  },
  // Image Upload Styles
  imagePurposeContainer: {
    backgroundColor: theme.colors.primary.beige,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  imagePurposeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  imagePurposeTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  imagePurposeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  imageGuidelines: {
    marginTop: theme.spacing.sm,
  },
  guidelinesTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  guidelinesList: {
    gap: theme.spacing.xs,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  rtlGuidelineItem: {
    flexDirection: "row-reverse",
  },
  guidelineText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  imagePreviewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: theme.spacing.sm,
  },
  imagePreviewLabel: {
    color: theme.colors.primary.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.primary.white,
    borderRadius: 12,
    padding: 4,
    ...theme.shadows.sm,
  },
  replaceImageButton: {
    position: "absolute",
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary.white,
    borderRadius: 12,
    padding: 4,
    ...theme.shadows.sm,
  },
  imageUploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  imageUploadButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.accent.lavender,
    borderStyle: "dashed",
    ...theme.shadows.sm,
  },
  imageUploadText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.accent.lavender,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  imageUploadSubtext: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    lineHeight: 16,
  },
  uploadSuccessContainer: {
    alignItems: "center",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.status.success + "10",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  uploadSuccessAnimation: {
    width: 60,
    height: 60,
  },
  uploadSuccessText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.status.success,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing.xs,
  },
  // URL Extraction Styles
  urlExtractionStatus: {
    backgroundColor: theme.colors.status.success + "10",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.status.success,
  },
  urlExtractionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  urlExtractionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.status.success,
    marginLeft: theme.spacing.xs,
  },
  extractedUrlText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    fontFamily: "monospace",
    lineHeight: 16,
  },
});

export default HomeScreen;
