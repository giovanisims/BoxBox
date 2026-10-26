import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/constants';

export const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 20,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 16,
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
