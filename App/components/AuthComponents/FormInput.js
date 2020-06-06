import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { MAIN_FONT } from '../MyAppText';
import { Colors } from '../../constants';

function FormInput({ style, placeholder, rightIcon, onFocus, onBlur, ...rest }) {
    const [focus, setFocus] = useState(false);

    return (
        <View
            style={[
                styles.inputContainer,
                style,
                focus ? { borderColor: Colors.appDarkGray } : null,
            ]}
        >
            <TextInput
                {...rest}
                placeholderTextColor={Colors.appGray}
                placeholder={placeholder}
                underlineColorAndroid="transparent"
                style={styles.input}
                onFocus={() => {
                    setFocus(true);
                    onFocus && onFocus();
                }}
                onBlur={() => {
                    setFocus(false);
                    onBlur && onBlur();
                }}
            />
            {rightIcon}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: Colors.appWhite,
        height: 30,
        flexDirection: 'row',
    },
    iconStyle: {
        marginRight: 5,
        marginLeft: 5,
    },
    input: {
        marginLeft: 5,
        fontFamily: MAIN_FONT,
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
});

export default FormInput;
