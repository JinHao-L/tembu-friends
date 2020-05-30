import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import Constants from 'expo-constants';

const STATUSBAR_HEIGHT = Constants.statusBarHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 28;

const MyStatusBar = ({ backgroundColor, ...props }) => (
    // <View style={{ height: STATUSBAR_HEIGHT, backgroundColor }}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
    // </View>
);

export default MyStatusBar;
