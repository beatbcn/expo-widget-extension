import { StyleSheet, Text, View } from 'react-native';

import * as ExpoWidgetExtension from '@beatbcn/expo-widget-extension';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoWidgetExtension.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
