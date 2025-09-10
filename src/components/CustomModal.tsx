import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { theme } from "../constants/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: "slide" | "fade" | "scale";
  backdropColor?: string;
  backdropOpacity?: number;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  animationType = "scale",
  backdropColor = "rgba(0, 0, 0, 0.5)",
  backdropOpacity = 1,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animations
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration: theme.animations.normal,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: theme.animations.normal,
          useNativeDriver: true,
        }),
        animationType === "scale"
          ? Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          : animationType === "slide"
          ? Animated.spring(slideAnim, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          : Animated.timing(opacityAnim, {
              toValue: 1,
              duration: theme.animations.normal,
              useNativeDriver: true,
            }),
      ]).start();
    } else {
      // Hide animations
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: theme.animations.fast,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: theme.animations.fast,
          useNativeDriver: true,
        }),
        animationType === "scale"
          ? Animated.timing(scaleAnim, {
              toValue: 0,
              duration: theme.animations.fast,
              useNativeDriver: true,
            })
          : animationType === "slide"
          ? Animated.timing(slideAnim, {
              toValue: screenHeight,
              duration: theme.animations.fast,
              useNativeDriver: true,
            })
          : Animated.timing(opacityAnim, {
              toValue: 0,
              duration: theme.animations.fast,
              useNativeDriver: true,
            }),
      ]).start();
    }
  }, [visible, animationType, backdropOpacity]);

  const getModalTransform = () => {
    switch (animationType) {
      case "scale":
        return [{ scale: scaleAnim }];
      case "slide":
        return [{ translateY: slideAnim }];
      default:
        return [];
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
      presentationStyle="overFullScreen"
    >
      <StatusBar backgroundColor="transparent" translucent />

      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
              backgroundColor: backdropColor,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Modal Content */}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.modalWrapper,
            {
              opacity: opacityAnim,
              transform: getModalTransform(),
            },
          ]}
        >
          {/* Gradient Background with Glass Effect */}
          <LinearGradient
            colors={theme.colors.gradients.lightGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBackground}
          >
            {/* Glass Overlay */}
            <BlurView intensity={20} style={styles.glassOverlay}>
              {/* Header with Close Button */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.title}>{title}</Text>
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[
                        theme.colors.accent.lavender,
                        theme.colors.accent.deepLavender,
                      ]}
                      style={styles.closeButtonGradient}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.text.white}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* Content */}
              <View style={styles.content}>{children}</View>
            </BlurView>

            {/* Accent Border */}
            <LinearGradient
              colors={[
                theme.colors.accent.lavender,
                theme.colors.accent.gold,
                theme.colors.accent.deepLavender,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentBorder}
            />
          </LinearGradient>

          {/* Floating Shadow */}
          <View style={styles.shadowContainer}>
            <LinearGradient
              colors={[
                "rgba(168, 85, 247, 0.3)",
                "rgba(168, 85, 247, 0.1)",
                "transparent",
              ]}
              style={styles.floatingShadow}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    zIndex: 9999,
    elevation: 9999,
  },
  modalWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
  },
  modalBackground: {
    borderRadius: theme.borderRadius["2xl"],
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  glassOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  closeButton: {
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
    ...theme.shadows.accent,
  },
  closeButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  accentBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: theme.borderRadius["2xl"],
    borderTopRightRadius: theme.borderRadius["2xl"],
  },
  shadowContainer: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    zIndex: -1,
  },
  floatingShadow: {
    flex: 1,
    borderRadius: theme.borderRadius["2xl"] + 10,
  },
});

export default CustomModal;
