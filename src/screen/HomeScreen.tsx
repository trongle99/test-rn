import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BLEPrinter,
  IBLEPrinter,
  INetPrinter,
  IUSBPrinter,
  NetPrinter,
  USBPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

export interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

export const PORT: string = '9100';

export enum DevicesEnum {
  usb = 'usb',
  net = 'net',
  blu = 'blu',
}
export interface DeviceType {
  host: string;
  port: string;
  device_name?: string;
  printerType?: string;
}

type ConnectionType = 'BLE' | 'NET';

interface BLEPrinterDevice {
  device_name: string;
  inner_mac_address: string;
}

interface NetPrinterDevice {
  host: string;
  port: number;
}

type PrinterDevice = BLEPrinterDevice | NetPrinterDevice;

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterDevice | null>(
    null,
  );
  const [connectionType, setConnectionType] = useState<ConnectionType | null>(
    null,
  );

  useEffect(() => {
    // Khởi tạo BLEPrinter khi component được mount
    BLEPrinter.init();
  }, []);

  const scanPrinters = async (type: ConnectionType) => {
    console.log('scanPrinters', type);
    if (type === 'NET') {
      return;
    }
    try {
      setConnectionType(type);
      let deviceList: PrinterDevice[] = [];
      if (type === 'BLE') {
        deviceList = await BLEPrinter.getDeviceList();
      } else if (type === 'NET') {
        deviceList = await NetPrinter.getDeviceList();
      }
      setPrinters(deviceList);
    } catch (error) {
      console.error('Lỗi khi quét máy in:', error);
      Alert.alert('Lỗi', 'Không thể quét máy in. Vui lòng thử lại.');
    }
  };

  const connectPrinter = async (printer: PrinterDevice) => {
    try {
      if (connectionType === 'BLE' && 'inner_mac_address' in printer) {
        await BLEPrinter.connectPrinter(printer.inner_mac_address);
      } else if (
        connectionType === 'NET' &&
        'host' in printer &&
        'port' in printer
      ) {
        await NetPrinter.connectPrinter(printer.host, printer.port);
      }
      setSelectedPrinter(printer);
      Alert.alert('Thành công', 'Đã kết nối với máy in.');
    } catch (error) {
      console.error('Lỗi khi kết nối máy in:', error);
      Alert.alert('Lỗi', 'Không thể kết nối với máy in. Vui lòng thử lại.');
    }
  };

  const printImage = async () => {
    if (!selectedPrinter) {
      Alert.alert('Lỗi', 'Vui lòng chọn một máy in trước.');
      return;
    }

    // Đây là một ví dụ về hình ảnh base64. Thay thế bằng hình ảnh thực tế của bạn.
    const imageBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

    try {
      if (connectionType === 'BLE') {
        BLEPrinter.printImageBase64(imageBase64);
      } else if (connectionType === 'NET') {
        NetPrinter.printImageBase64(imageBase64);
      }
      Alert.alert('Thành công', 'Đã in hình ảnh.');
    } catch (error) {
      console.error('Lỗi khi in hình ảnh:', error);
      Alert.alert('Lỗi', 'Không thể in hình ảnh. Vui lòng thử lại.');
    }
  };

  const renderPrinterItem = ({item}: {item: PrinterDevice}) => (
    <TouchableOpacity
      style={styles.printerItem}
      onPress={() => connectPrinter(item)}>
      <Text>
        {connectionType === 'BLE' && 'device_name' in item
          ? item.device_name
          : 'host' in item
          ? item.host
          : ''}
      </Text>
    </TouchableOpacity>
  );

  // const handlePrintBillWithImage = async () => {
  //   const Printer: typeof NetPrinter = printerList[selectedValue];
  //   Printer.printImage(
  //     'https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/3a/bd/b5/the-food-bill.jpg',
  //     {
  //       imageWidth: 575,
  //       // imageHeight: 1000,
  //       // paddingX: 100
  //     },
  //   );
  //   Printer.printBill('', {beep: false});
  // };

  return (
    <View style={styles.container}>
      <Button
        title="Go to ActionSheet Screen"
        onPress={() => navigation.navigate('ActionSheet')}
      />

      <Pressable style={styles.button} onPress={() => scanPrinters('BLE')}>
        <Text style={styles.buttonText}>Quét máy in BLE</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.button}
        onPress={() => scanPrinters('NET')}>
        <Text style={styles.buttonText}>Quét máy in NET</Text>
      </TouchableOpacity>
      <FlatList
        data={printers}
        renderItem={renderPrinterItem}
        keyExtractor={item =>
          'inner_mac_address' in item ? item.inner_mac_address : item.host
        }
      />
      <TouchableOpacity style={styles.button} onPress={printImage}>
        <Text style={styles.buttonText}>In hình ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  printerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
