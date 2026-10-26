import { StyleSheet } from 'react-native';
import { COLORS } from './constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    flexGrow: 1,
  },
  footerLoader: {
    marginVertical: 20,
  },
});
