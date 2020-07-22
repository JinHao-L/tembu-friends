import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';

import { MAIN_FONT } from '../Commons';
import { Colors } from '../../constants';
import ErrorMessage from './ErrorMessage';

function FormInput({
    containerStyle,
    style,
    isError,
    errorMessage,
    errorStyle,
    placeholder,
    rightIcon,
    onFocus,
    onBlur,
    ...rest
}) {
    const [focus, setFocus] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[
                    styles.inputContainer,
                    style,
                    isError
                        ? { borderColor: Colors.appRed }
                        : focus
                        ? { borderColor: Colors.appGray5 }
                        : { borderColor: Colors.appGray2 },
                ]}
            >
                <TextInput
                    {...rest}
                    placeholderTextColor={Colors.appGray2}
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
            <ErrorMessage style={errorStyle} error={errorMessage ? errorMessage : ' '} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: Colors.appWhite,
        flexDirection: 'row',
    },
    input: {
        marginLeft: 5,
        fontFamily: MAIN_FONT,
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 5 : 0,
        textAlignVertical: 'center',
    },
});

export default FormInput;
