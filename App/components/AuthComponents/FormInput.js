import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { textStyles } from '../MyAppText';

function FormInput({ style, leftIconName, iconColor, placeholder, rightIcon, ...rest }) {
    return (
        <View style={[styles.inputContainer, style]}>
            {/**<Ionicons
                name={leftIconName}
                size={28}
                style={styles.iconStyle}
                color={iconColor ? iconColor : Colors.textIconDefault}
            />**/}
            <TextInput
                {...rest}
                placeholderTextColor="#b1b1b1"
                placeholder={placeholder}
                underlineColorAndroid="transparent"
                style={styles.input}
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
        backgroundColor: 'white',
        height: 30,
        flexDirection: 'row',
    },
    iconStyle: {
        marginRight: 5,
        marginLeft: 5,
    },
    input: {
        marginLeft: 5,
        ...textStyles,
        fontSize: 15,
        flex: 1,
    },
});

export default FormInput;
