import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply } from 'video-editor-react-native';

export default function App() {
   const [result, setResult] = React.useState<string | undefined>();

  React.useEffect(() => {multiply().then(setResult); }, []);

  return (
    <View style={styles.container}>
      <Text>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
