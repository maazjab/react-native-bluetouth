import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import BleManager from 'react-native-ble-manager';
import {
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.BleManager);

const App = () => {
  async function getBluetoothScanPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Bluetooth Permission',
        message:
          'In the next dialogue, Android will ask for permission for this ' +
          'App to access your location. This is needed for being able to ' +
          'use Bluetooth to scan your environment for peripherals.',
        buttonPositive: 'OK',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('BleManager.scan will *NOT* detect any peripherals!');
    }
  }

  const scan = async () => {
    eventEmitter.addListener('BleManagerDiscoverPeripheral', async args => {
      console.log(args);
    });

    eventEmitter.addListener('BleManagerStopScan', () => {
      console.log('done');
    });

    console.log("started")
    await BleManager.start( { forceLegacy: true } )
    console.log("check location access permission")
    await getBluetoothScanPermission()
    console.log("scanning")
    await BleManager.scan([], 5)
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{textAlign: 'center'}}>Module Bluetooth</Text>
      <Button title="Scan bluetouth" onPress={() => scan()} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
