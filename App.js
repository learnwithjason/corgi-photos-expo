import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useCorgis } from './db';

function App() {
  const [boopedCorgi, setBoopedCorgi] = useState();
  const corgis = useCorgis();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>Behold! My Corgis!</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {corgis
            ? corgis.map((corgi) => (
                <TouchableOpacity
                  key={corgi.id}
                  onPress={() => {
                    setBoopedCorgi(corgi);
                  }}
                >
                  <Image
                    source={{
                      uri: corgi.url,
                    }}
                    style={{
                      height: Dimensions.get('window').width / 3,
                      width: Dimensions.get('window').width / 3,
                    }}
                    resizeMode="cover"
                    accessible={true}
                    accessibilityLabel="corgi"
                  />
                </TouchableOpacity>
              ))
            : null}
        </View>
      </ScrollView>
      <Modal transparent={true} visible={!!boopedCorgi} animationType="fade">
        {boopedCorgi ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              ...Platform.select({
                web: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                },
              }),
            }}
          >
            <TouchableOpacity onPress={() => setBoopedCorgi(null)}>
              <Image
                source={{
                  uri: boopedCorgi.url,
                }}
                style={{
                  height: Dimensions.get('window').width * 0.9,
                  width: Dimensions.get('window').width * 0.9,
                  ...Platform.select({
                    web: {
                      maxHeight: 300,
                      maxWidth: 300,
                    },
                  }),
                }}
                resizeMode="cover"
                accessible={true}
                accessibilityLabel="corgi"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default function AppContainer() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
