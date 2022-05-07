
  const startBleManger = async booleanValue => {
    await BleManager.start({showAlert: booleanValue}).then(() => {
      // Success code
      console.log('Module initialized');
    });
  };
  const scanNearByDevices = async (
    serviceUUIDList,
    duration,
    isAllowDuplicates,
  ) => {
    await BleManager.scan(serviceUUIDList, duration, isAllowDuplicates).then(
      results => {
        console.log('Scanning...');
        // this.setState({scanning: true});
      },
    );
  };

  const getPeripheralsDevices = async () => {

    NativeAppEventEmitter.addListener("BleManagerDiscoverPeripheral", (data) => {
      // The new state: args.state
      console.log(data)
    });


    
  };

  const getPeripheralsConnected = async () => {
    await BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
      // Success code
      console.log('Connected peripherals: ' + peripheralsArray.length);
    });

  };

  const enableBluetouth = () => {
    BleManager.enableBluetooth()
      .then(async () => {
        // Success code
        startBleManger()
          .then(() => {
            scanNearByDevices([], 30, true)
              .then(() => {
                getPeripheralsDevices();
                
              })
              .catch(err => console.log('error scan'));
          })
          .catch(err => console.error('error manager start'));
      })
      .catch(error => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
  };