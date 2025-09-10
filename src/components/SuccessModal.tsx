import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  showConfetti?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  showConfetti = true,
}) => {
  const { t, isRTL } = useLanguage();

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
    onClose();
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
      animationType="scale"
    >
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        {/* Success Icon with Animation */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[
              `${theme.colors.status.success}30`,
              `${theme.colors.status.success}10`,
            ]}
            style={styles.iconBackground}
          >
            <Ionicons
              name="checkmark-circle"
              size={64}
              color={theme.colors.status.success}
            />
            
            {/* Pulse Rings */}
            <View style={[styles.pulseRing, styles.pulseRing1]} />
            <View style={[styles.pulseRing, styles.pulseRing2]} />
          </LinearGradient>
          
          {/* Confetti/Sparkles */}
          {showConfetti && (
            <>
              <View style={[styles.confetti, styles.confetti1]}>
                <Text style={styles.confettiText}>🎉</Text>
              </View>
              <View style={[styles.confetti, styles.confetti2]}>
                <Text style={styles.confettiText}>✨</Text>
              </View>
              <View style={[styles.confetti, styles.confetti3]}>
                <Text style={styles.confettiText}>🎊</Text>
              </View>
              <View style={[styles.confetti, styles.confetti4]}>
                <Text style={styles.confettiText}>⭐</Text>
              </View>
              <View style={[styles.confetti, styles.confetti5]}>
                <Text style={styles.confettiText}>💫</Text>
              </View>
              <View style={[styles.confetti, styles.confetti6]}>
                <Text style={styles.confettiText}>🌟</Text>
              </View>
            </>
          )}
        </View>

        {/* Message */}
        <Text style={[styles.message, isRTL && styles.rtlText]}>
          {message}
        </Text>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, isRTL && styles.rtlButtonContainer]}>
          {/* Secondary Button (if provided) */}
          {secondaryButtonText && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSecondaryPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.primary.white, theme.colors.neutral.gray100]}
                style={styles.buttonGradient}
              >
                <Text style={[styles.secondaryButtonText, isRTL && styles.rtlText]}>
                  {secondaryButtonText}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              !secondaryButtonText && styles.fullWidthButton,
            ]}
            onPress={handlePrimaryPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.status.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.primaryButtonText, isRTL && styles.rtlText]}>
                {primaryButtonText || t('common.ok')}
              </Text>
              <Ionicons
                name="checkmark"
                size={20}
                color={theme.colors.text.white}
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  rtlContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: theme.colors.status.success,
    opacity: 0.3,
  },
  pulseRing1: {
    width: 140,
    height: 140,
  },
  pulseRing2: {
    width: 160,
    height: 160,
    opacity: 0.2,
  },
  confetti: {
    position: 'absolute',
  },
  confetti1: {
    top: -20,
    left: -10,
  },
  confetti2: {
    top: -15,
    right: -5,
  },
  confetti3: {
    bottom: -10,
    left: 5,
  },
  confetti4: {
    bottom: -5,
    right: 10,
  },
  confetti5: {
    top: 10,
    left: -25,
  },
  confetti6: {
    top: 15,
    right: -20,
  },
  confettiText: {
    fontSize: 20,
  },
  message: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  rtlText: {
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing.md,
  },
  rtlButtonContainer: {
    flexDirection: 'row-reverse',
  },
  button: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButton: {
    ...theme.shadows.md,
  },
  secondaryButton: {
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  secondaryButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  buttonIcon: {
    marginLeft: theme.spacing.sm,
  },
});

export default SuccessModal;
