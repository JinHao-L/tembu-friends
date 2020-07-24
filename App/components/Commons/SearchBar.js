import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';

function SearchBar({
    placeholder = 'Search',
    autoCapitalize = 'words',
    value,
    onChangeText,
    onEndEditing = undefined,
    onCancel,
    loading = false,
    style,
}) {
    return (
        <Input
            containerStyle={[styles.inputContainer, style]}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            value={value}
            onChangeText={onChangeText}
            onEndEditing={
                onEndEditing ? ({ nativeEvent: { text } }) => onEndEditing(text) : undefined
            }
            placeholderTextColor={Colors.appGray4}
            inputStyle={styles.searchBarInput}
            inputContainerStyle={styles.inputContentContainer}
            leftIcon={{
                size: 18,
                name: 'search',
                color: Colors.appGray4,
            }}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            rightIcon={
                loading ? (
                    <ActivityIndicator size={18} />
                ) : value ? (
                    {
                        size: 18,
                        name: 'cancel',
                        color: Colors.appGray4,
                        onPress: onCancel,
                    }
                ) : undefined
            }
            rightIconContainerStyle={styles.rightIconContainerStyle}
            renderErrorMessage={false}
        />
    );
}

const styles = StyleSheet.create({
    searchBarInput: {
        marginLeft: 10,
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    inputContainer: {
        backgroundColor: Colors.appWhite,
    },
    inputContentContainer: {
        height: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.appGray4,
        backgroundColor: Colors.appWhite,
    },
    leftIconContainerStyle: {
        paddingLeft: 8,
    },
    rightIconContainerStyle: {
        marginRight: 8,
    },
});

export default SearchBar;
