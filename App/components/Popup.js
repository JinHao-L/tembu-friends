import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';

import { MainText } from './MyAppText';
import { BorderlessButton } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

class Popup extends Component {
    state = {
        opacityAnim: new Animated.Value(0),
        viewPosition: new Animated.Value(height),
        popupPosition: new Animated.Value(height),
        popupHeight: 0,
    };

    static instance;

    static show({ ...params }) {
        this.instance.showPopup(params);
    }

    static hide() {
        this.instance.hidePopup();
    }

    showPopup({ ...params }) {
        console.log(params);
        this.setState(
            {
                title: params.title,
                body: params.body,
                showButton: params.showButton,
                buttonText: params.buttonText,
                callback: params.callback || this.defaultCallback,
                background: params.background || 'rgba(0,0,0,0.5)',
                autoClose: params.autoClose,
                type: params.type,
            },
            () => {
                if (this.state.autoClose) {
                    console.log('HIDING');
                    setTimeout(() => {
                        this.hidePopup();
                    }, 5000);
                }
            }
        );

        console.log(this.state.popupHeight);

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
                toValue: height / 2 - this.state.popupHeight / 2,
                bounciness: 15,
                useNativeDriver: true,
            }),
        ]).start();

        console.log('DONE');
    }

    hidePopup() {
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
        console.log('Default: hiding popup');
        return this.hidePopup();
    }

    getImage(type) {
        switch (type) {
            case 'Success':
                return require('../assets/images/success-icon.png');
            case 'Failure':
                return require('../assets/images/invalid-icon.png');
            // case 'Warning':
            //     return require('../asset')
            default:
                return require('../assets/images/robot-dev.png');
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
                ref={(c) => (this._root = c)}
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
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        {showButton && (
                            <View style={styles.button}>
                                <BorderlessButton onPress={callback}>
                                    <View accessible>
                                        <MainText style={styles.buttonText}>{buttonText}</MainText>
                                    </View>
                                </BorderlessButton>
                            </View>
                        )}
                    </View>
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
        maxWidth: 300,
        width: 230,
        minHeight: 300,
        backgroundColor: '#fff',
        borderRadius: 30,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        height: 230,
        width: 230,
        backgroundColor: '#FBFBFB',
        borderRadius: 100,
        marginTop: -120,
    },
    image: {
        width: 150,
        height: 80,
        position: 'absolute',
        top: 20,
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
    button: {
        height: 40,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 18,
        color: '#222',
    },
});

export default Popup;
