import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../Commons';

const WebNavButton = ({ title, disabled, onPress, loading }) => {
    return (
        <Button
            containerStyle={{ flex: 1, borderRadius: 0 }}
            buttonStyle={{
                backgroundColor: Colors.appGreen,
                borderRadius: 0,
                borderRightWidth: StyleSheet.hairlineWidth,
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.appWhite,
            }}
            title={title}
            titleStyle={{ fontFamily: MAIN_FONT, fontSize: 15, color: Colors.appWhite }}
            onPress={onPress}
            disabledStyle={{
                backgroundColor: Colors.appGray1,
                borderRadius: 0,
                borderRightWidth: StyleSheet.hairlineWidth,
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.appWhite,
            }}
            disabledTitleStyle={{ fontFamily: MAIN_FONT, fontSize: 15, color: Colors.appGray2 }}
            disabled={disabled}
            loading={loading}
            loadingStyle={{ height: 19 }}
        />
    );
};

export default WebNavButton;
