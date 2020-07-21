import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../Commons';

const WebNavButton = ({ title, disabled, onPress }) => {
    return (
        <Button
            containerStyle={{ flex: 1, borderRadius: 0 }}
            buttonStyle={{
                backgroundColor: Colors.appGreen,
                borderRadius: 0,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.appWhite,
            }}
            title={title}
            titleStyle={{ fontFamily: MAIN_FONT, fontSize: 15, color: Colors.appWhite }}
            onPress={onPress}
            disabledStyle={{ backgroundColor: Colors.appGray1 }}
            disabledTitleStyle={{ color: Colors.appGray2 }}
            disabled={disabled}
        />
    );
};

export default WebNavButton;
