import { StyleSheet } from 'react-native';
import { COLORS } from './constants';

export const styles = StyleSheet.create({
  image: {
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.skeletonBackground,
  },
  placeholder: {
    backgroundColor: COLORS.placeholderBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.placeholderText,
    fontSize: 13,
    fontWeight: '600',
  },
});
