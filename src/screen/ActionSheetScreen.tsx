import {Button, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
} from 'react-native-actions-sheet';
import {TextInput} from 'react-native-gesture-handler';

const {height} = Dimensions.get('window');

const ActionSheetScreen = () => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <View>
      <Text>ActionSheetScreen</Text>

      <Button
        title="Open Nested Sheet"
        onPress={() => SheetManager.show('nested-sheets')}
      />
      <Button title="Open" onPress={() => actionSheetRef.current?.show()} />

      <ActionSheet ref={actionSheetRef}>
        <View style={{height: height}}>
          <Text>Hi, I am here.</Text>
          <TextInput style={{borderWidth: 1}} />
          {/* <Button title="Close" onPress={() => actionSheetRef.current?.hide()} /> */}
        </View>
      </ActionSheet>
    </View>
  );
};

export default ActionSheetScreen;

const styles = StyleSheet.create({});
