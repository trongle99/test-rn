/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PushNotification from 'react-native-push-notification';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DropdownMenu from './components/DropdownMenu';

function App(): React.JSX.Element {
  // const cameraRef = useRef<CameraApi>(null);

  // const [cameraType, setCameraType] = useState(CameraType.Back);
  // const [barcode, setBarcode] = useState<string>('');

  // useEffect(() => {
  //   const t = setTimeout(() => {
  //     setBarcode('');
  //   }, 2000);
  //   return () => {
  //     clearTimeout(t);
  //   };
  // }, [barcode]);

  // #region WEBSOCKET TEST
  const [message, setMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     // Request permissions (required for iOS)
  //     await notifee.requestPermission();

  //     // Create a channel (required for Android)
  //     await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //       importance: AndroidImportance.HIGH,
  //     });
  //   })();

  //   // Kết nối tới WebSocket server
  //   const ws = new WebSocket('ws://192.168.1.141:8080');

  //   // Khi kết nối được mở
  //   ws.onopen = () => {
  //     console.log('WebSocket connection opened');
  //     setIsConnected(true);
  //     // Gửi thông điệp tới server (nếu cần)
  //     ws.send('Hello Server!');
  //   };

  //   // Khi nhận được tin nhắn từ server
  //   ws.onmessage = async event => {
  //     console.log('Received message:', event.data);
  //     setMessage(event.data);

  //     // Hiển thị thông báo
  //     await notifee.displayNotification({
  //       title: 'New Message',
  //       body: event.data,
  //       android: {
  //         channelId: 'default', // ID của kênh thông báo
  //         smallIcon: 'ic_launcher', // Ảnh nho nhat
  //         largeIcon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', // Ảnh đầu nho nhat
  //         importance: AndroidImportance.HIGH,
  //       },
  //     });
  //   };

  //   // Khi có lỗi xảy ra
  //   ws.onerror = error => {
  //     console.log('WebSocket error:', error.message);
  //     setIsConnected(false);
  //   };

  //   // Khi kết nối bị đóng
  //   ws.onclose = () => {
  //     console.log('WebSocket connection closed');
  //     setIsConnected(false);
  //   };

  //   // Đóng kết nối khi component bị unmount
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  // #endregion WEBSOCKET TEST

  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null);

  // callbacks
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleExpandPress2 = useCallback(() => {
    bottomSheetModalRef2.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleClosePress2 = useCallback(() => {
    bottomSheetModalRef2.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View style={{padding: 20}}>
            <Text>
              Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
            <Text>Message: {message}</Text>
          </View>

          <DropdownMenu title="Options" position="right">
            <DropdownMenu.Item onSelect={handleExpandPress}>
              <Text>Option 1</Text>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={handleExpandPress2}>
              <Text>Option 2</Text>
            </DropdownMenu.Item>
          </DropdownMenu>

          <Button onPress={handleExpandPress} title="Open" />
          <Button onPress={handleClosePress} title="Close" />
          <BottomSheetModal
            ref={bottomSheetRef}
            enableDynamicSizing
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={styles.body}>
              <TextInput style={styles.input} placeholder="Field input" />

              <Button onPress={handleExpandPress2} title="Open Modal 2" />
              <Button onPress={handleClosePress} title="Close" />
            </BottomSheetView>
          </BottomSheetModal>

          <BottomSheetModal
            ref={bottomSheetModalRef2}
            enableDynamicSizing
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={styles.body}>
              <Text>Modal 2</Text>
              <Button onPress={handleClosePress2} title="Close Modal 2" />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#dedede',
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
});

export default App;
