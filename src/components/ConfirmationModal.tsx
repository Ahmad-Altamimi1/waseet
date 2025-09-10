import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmStyle?: 'primary' | 'danger' | 'success';
  icon?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmStyle = 'primary',
  icon = 'help-circle-outline',
}) => {
  const { t, isRTL } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const getConfirmColors = () => {
    switch (confirmStyle) {
      case 'danger':
        return ['#EF4444', '#DC2626'];
      case 'success':
        return [theme.colors.status.success, '#059669'];
      default:
        return [theme.colors.accent.lavender, theme.colors.accent.deepLavender];
    }
  };

  const getIconColor = () => {
    switch (confirmStyle) {
      case 'danger':
        return '#EF4444';
      case 'success':
        return theme.colors.status.success;
      default:
        return theme.colors.accent.lavender;
    }
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
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[
              `${getIconColor()}20`,
              `${getIconColor()}10`,
            ]}
            style={styles.iconBackground}
          >
            <Ionicons
              name={icon as any}
              size={48}
              color={getIconColor()}
            />
          </LinearGradient>
        </View>

        {/* Message */}
        <Text style={[styles.message, isRTL && styles.rtlText]}>
          {message}
        </Text>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, isRTL && styles.rtlButtonContainer]}>
          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, isRTL && styles.rtlButton]}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.neutral.gray200, theme.colors.neutral.gray300]}
              style={styles.buttonGradient}
            >
              <Text style={[styles.cancelButtonText, isRTL && styles.rtlText]}>
                {cancelText || t('common.cancel')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.button, styles.confirmButton, isRTL && styles.rtlButton]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={getConfirmColors()}
              style={styles.buttonGradient}
            >
              <Text style={[styles.confirmButtonText, isRTL && styles.rtlText]}>
                {confirmText || t('common.ok')}
              </Text>
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
    paddingVertical: theme.spacing.md,
  },
  rtlContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
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
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  rtlButton: {
    alignSelf: 'stretch',
  },
  cancelButton: {
    ...theme.shadows.sm,
  },
  confirmButton: {
    ...theme.shadows.md,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  confirmButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
});

export default ConfirmationModal;
