import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MainText } from '../Commons/MyAppText';

function RadioButton(props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={props.onPress}>
                <View style={[styles.outer, { borderColor: props.tintColor }, props.style]}>
                    {props.selected ? (
                        <View style={[styles.inner, { backgroundColor: props.tintColor }]} />
                    ) : null}
                </View>
            </TouchableOpacity>
            {props.text && <MainText style={styles.text}>{props.text}</MainText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    outer: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    inner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    text: {
        textAlignVertical: 'center',
    },
});

export default RadioButton;
