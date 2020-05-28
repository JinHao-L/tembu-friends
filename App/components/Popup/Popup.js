import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';

import { MainText } from '../MyAppText';
import { BorderlessButton } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

class Popup extends Component {
    state = {
        opacityAnim: new Animated.Value(0),
        viewPosition: new Animated.Value(height),
        popupPosition: new Animated.Value(height),
        popupHeight: 0,
        verticalOffset: 0,
    };

    static instance;

    static show({ ...params }) {
        this.instance.showPopup(params);
    }

    static hide() {
        this.instance.hidePopup();
    }

    showPopup({ ...params }) {
        this.setState(
            {
                title: params.title,
                body: params.body,
                showButton: params.showButton === undefined ? true : params.showButton,
                buttonText: params.buttonText,
                callback: params.callback || this.defaultCallback.bind(this),
                background: params.background || 'rgba(0,0,0,0.5)',
                autoClose: params.autoClose,
                type: params.type,
                verticalOffset: params.verticalOffset,
            },
            () => {
                Animated.sequence([
                    Animated.timing(this.state.viewPosition, {
                        toValue: 0,
                        duration: 100,
                    }),
                    Animated.timing(this.state.opacityAnim, {
                        toValue: 1,
                        duration: 300,
                    }),
                    Animated.spring(this.state.popupPosition, {
                        toValue:
                            height / 2 - this.state.popupHeight / 2 - this.state.verticalOffset,
                        bounciness: 15,
                        useNativeDriver: true,
                    }),
                ]).start();

                if (this.state.autoClose) {
                    console.log('HIDING');
                    this.startTimer.bind(this)();
                }
            }
        );
        console.log('DONE');
    }

    startTimer() {
        this.timer = setTimeout(() => {
            this.hidePopup();
        }, 5000);
    }

    clearTimer() {
        this.timer !== undefined ? this.clearTimeout(this.timer) : null;
    }

    hidePopup() {
        this.clearTimer.bind(this);
        Animated.sequence([
            Animated.timing(this.state.popupPosition, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.opacityAnim, {
                toValue: 0,
                duration: 300,
            }),
            Animated.timing(this.state.viewPosition, {
                toValue: height,
                duration: 100,
            }),
        ]).start();
        console.log('HIDE');
    }

    defaultCallback() {
        return this.hidePopup();
    }

    getImage(type) {
        switch (type) {
            case 'Success':
                return require('../../assets/images/success-icon.png');
            case 'Failure':
                return require('../../assets/images/invalid-icon.png');
            case 'Testing':
                return require('../../assets/images/robot-dev.png');
            //TODO: Find a warning picture
            // case 'Warning':
            //     return require('../../assets/images/robot-dev.png');
            default:
                return require('../../assets/images/robot-prod.png');
        }
    }
    render() {
        const {
            background,
            opacityAnim,
            viewPosition,
            popupPosition,
            title,
            body,
            showButton,
            buttonText,
            callback,
            type,
        } = this.state;
        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: background,
                        opacity: opacityAnim,
                        transform: [{ translateY: viewPosition }],
                    },
                ]}
            >
                <Animated.View
                    onLayout={(event) => {
                        this.setState({ popupHeight: event.nativeEvent.layout.height });
                    }}
                    style={[
                        styles.message,
                        {
                            transform: [{ translateY: popupPosition }],
                        },
                    ]}
                >
                    <View style={styles.header} />
                    <Image
                        source={this.getImage(type)}
                        resizeMode={'contain'}
                        style={styles.image}
                    />
                    <View style={styles.content}>
                        <MainText style={styles.title}>{title}</MainText>
                        <MainText style={styles.body}>{body}</MainText>
                    </View>
                    {showButton && (
                        <View style={styles.buttonContainer}>
                            <View style={styles.line} />
                            <BorderlessButton onPress={callback}>
                                <View accessible>
                                    <MainText style={styles.buttonText}>{buttonText}</MainText>
                                </View>
                            </BorderlessButton>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 9,
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        top: 0,
        left: 0,
    },
    message: {
        maxWidth: 400,
        width: 280,
        minHeight: 200,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute',
    },
    header: {
        flex: 1,
        height: 100,
        width: 280,
        backgroundColor: '#fff',
    },
    image: {
        width: 150,
        height: 80,
        position: 'absolute',
        top: 30,
    },
    content: {
        padding: 30,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    title: {
        fontWeight: '200',
        fontSize: 18,
        color: '#333',
    },
    body: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
    },
    line: {
        width: 280,
        borderBottomColor: '#222',
        borderWidth: 0.5,
    },
    buttonText: {
        fontSize: 18,
        color: '#222',
        margin: 10,
    },
});

export default Popup;
