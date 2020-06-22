import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

import { MAIN_FONT, MainText } from './MyAppText';
import { Colors } from '../constants';

const { width, height } = Dimensions.get('window');

function Popup({
    isVisible,
    title,
    body,
    buttonText,
    callback,
    imageType,
    additionalButtonText,
    additionalButtonCall,
}) {
    return (
        <Overlay
            animationType={'fade'}
            animated={true}
            isVisible={isVisible}
            onBackdropPress={callback}
            overlayStyle={styles.container}
        >
            <View style={styles.message}>
                {(imageType === 'Custom' && body) || (
                    <View style={styles.message}>
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
                <View style={styles.line} />
                {additionalButtonCall && (
                    <Button
                        title={additionalButtonText}
                        type={'clear'}
                        titleStyle={styles.buttonText}
                        onPress={additionalButtonCall}
                        containerStyle={styles.buttonContainer}
                    />
                )}
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
            </View>
        </Overlay>
    );
}

function getImage(type) {
    switch (type) {
        case 'Success':
            return require('../assets/images/success-icon.png');
        case 'Failure':
            return require('../assets/images/invalid-icon.png');
        case 'Testing':
            return require('../assets/images/robot-dev.png');
        case 'Warning':
            return require('../assets/images/warning-icon.png');
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        width: 280 > width / 2 ? 280 : width / 2,
        minHeight: 200,
        backgroundColor: Colors.appWhite,
        borderRadius: 20,
        paddingBottom: 0,
    },
    message: {
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 80,
        top: 10,
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
        fontWeight: '200',
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
    },
    body: {
        fontSize: 15,
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
    },
    line: {
        width: 280 > width / 2 ? 280 : width / 2,
        borderBottomColor: '#222',
        borderWidth: 0.5,
    },
    buttonText: {
        fontFamily: MAIN_FONT,
        fontSize: 18,
        color: '#222',
    },
});

export default Popup;
