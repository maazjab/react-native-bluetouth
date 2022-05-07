import {StyleSheet, Text, View, PermissionsAndroid, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';
import {LogBox} from 'react-native';

const App = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  //What device is connected?
  const manager = new BleManager();

  async function scanAndConnect() {
    console.log('d')
    let uniqId;
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(answere => {
      console.log('scanning.....');
      // display the Activityindicator
      let devices = [];
      manager.startDeviceScan(
        null,
        {allowDuplicates: false},
        (error, device) => {
          if (error) {
            console.warn(error);
          }

          if (device != null && device.id != null) devices.push(device.id);

          uniqId = devices.filter((a, b, c) => c.indexOf(a) == b);

          if (device.id === '47:96:69:7E:18:20') {
            device
              .connect()
              .then(device => {
                const services = device.discoverAllServicesAndCharacteristics();

                console.log(services);
              })
              .catch(error => {
                // Handle errors
                console.log(error);
              });
          }
          // if (scannedDevice && scannedDevice.name == 'BLEExample') {
          // connectDevice(scannedDevice);
          // }
        },
      );

      // stop scanning devices after 5 seconds
      setTimeout(() => {
        console.log(uniqId);

        manager.stopDeviceScan();
      }, 5000);
    });
  }

  const scan = () => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
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
