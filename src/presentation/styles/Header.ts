import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/constants';

export const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 16,
    zIndex: 1000,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f4f4f6',
  },
  navButtonText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
