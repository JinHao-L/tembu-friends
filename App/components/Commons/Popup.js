import React from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

import { MAIN_FONT, MainText } from './MyAppText';
import { Colors } from '../../constants';

const { width } = Dimensions.get('window');

function Popup({
    isVisible,
    title,
    body,
    buttonText,
    callback,
    defaultCallback = callback,
    imageType,
    additionalButtonText,
    additionalButtonCall,
}) {
    return (
        <Overlay
            animationType={'fade'}
            animated={true}
            isVisible={isVisible}
            onBackdropPress={defaultCallback}
            overlayStyle={styles.container}
        >
            <View style={styles.message}>
                {imageType === 'Custom' ? (
                    <View style={{ width: '100%' }}>
                        {title && <MainText style={styles.title}>{title}</MainText>}
                        {title && <View style={styles.line} />}
                        {body}
                    </View>
                ) : (
                    <View>
                        <Image
                            source={getImage(imageType)}
                            resizeMode={'contain'}
                            style={styles.image}
                        />
                        <View style={styles.content}>
                            <MainText style={styles.title}>{title}</MainText>
                            <MainText style={styles.body}>{body}</MainText>
                        </View>
                    </View>
                )}

                {buttonText && <View style={styles.line} />}
                {additionalButtonCall && (
                    <Button
                        title={additionalButtonText}
                        type={'clear'}
                        titleStyle={styles.buttonText}
                        onPress={additionalButtonCall}
                        containerStyle={styles.buttonContainer}
                    />
                )}
                {additionalButtonText && Platform.OS === 'ios' && <View style={styles.line} />}
                {buttonText && (
                    <Button
                        title={buttonText}
                        type={'clear'}
                        titleStyle={styles.buttonText}
                        onPress={callback}
                        containerStyle={[
                            styles.buttonContainer,
                            { borderBottomEndRadius: 20, borderBottomStartRadius: 20 },
                        ]}
                    />
                )}
            </View>
        </Overlay>
    );
}

function getImage(type) {
    switch (type) {
        case 'Success':
            return require('../../assets/images/popup/success-icon.png');
        case 'Failure':
            return require('../../assets/images/popup/invalid-icon.png');
        case 'Warning':
            return require('../../assets/images/popup/warning-icon.png');
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    container: {
        width: 280 > width / 2 ? 280 : width / 2,
        backgroundColor: Colors.appWhite,
        borderRadius: 20,
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginHorizontal: 0,
    },
    message: {
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: 150,
        height: 80,
        top: 10,
        alignSelf: 'center',
        marginTop: 5,
    },
    content: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        width: 280 > width / 2 ? 280 : width / 2,
        borderRadius: 0,
    },
    title: {
        fontWeight: '600',
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        paddingVertical: 10,
        justifyContent: 'center',
    },
    body: {
        fontSize: 15,
        textAlign: 'center',
        color: '#666',
    },
    line: {
        width: 280 > width / 2 ? 280 : width / 2,
        borderBottomColor: Colors.appGray1,
        borderWidth: StyleSheet.hairlineWidth,
    },
    buttonText: {
        fontFamily: MAIN_FONT,
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
});

export const Separator = ({ style }) => {
    return <View style={[styles.line, style]} />;
};

Popup.Separator = Separator;

export default Popup;
