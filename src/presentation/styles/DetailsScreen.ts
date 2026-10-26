import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/constants';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  image: {
    width: 260,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  placeholderText: {
    color: '#bbbbbb',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.primary,
    minHeight: 44,
  },
  actionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  watchedButton: {
    borderColor: COLORS.secondary,
  },
  watchedButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  watchedButtonText: {
    color: COLORS.secondary,
  },
  actionButtonTextActive: {
    color: '#ffffff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 4,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  starButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#f4f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.errorText,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
