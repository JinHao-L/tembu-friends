import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BaseButton } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';

import { Colors } from '../../constants';
import { MainText } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class ScanQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasPermission: false,
            message: '',
            canScan: false,
            uri: null,

            barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        };
        this.unsubscribe = this.props.navigation.addListener('blur', () => {
            this.setState({
                canScan: false,
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    openGallery = async () => {
        this.setState({
            uri: null,
            message: '',
        });
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to get a QR code picture!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({
                uri: result.uri,
            });
            return BarCodeScanner.scanFromURLAsync(result.uri, this.state.barcodeTypes).then(
                (result) => {
                    if (result.length === 0) {
                        this.setState({
                            message: 'No QR detected',
                            canScan: false,
                        });
                    } else if (result.length > 1) {
                        this.setState({
                            message: 'Multiple QR detected. Please use only one',
                            canScan: false,
                        });
                    } else {
                        this.handleScan(result[0]);
                    }
                }
            );
        }
    };

    openCamera = async () => {
        if (this.state.hasPermission) {
            this.setState({
                uri: null,
                message: '',
                canScan: true,
            });
        }
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status === 'granted') {
            this.setState({
                uri: null,
                hasPermission: true,
                message: '',
                canScan: true,
            });
        } else {
            this.setState({
                uri: null,
                hasPermission: true,
                message: 'No access to camera',
                canScan: false,
            });
        }
    };

    handleScan = ({ type, data }) => {
        this.setState({
            canScan: false,
        });
        if (type === BarCodeScanner.Constants.BarCodeType.qr) {
            const uid = this.validateQRData(data);
            if (uid) {
                return this.goToProfile(uid);
            } else {
                return this.setState({
                    message: 'Invalid TembuFriends QR Code',
                });
            }
        }
        return this.setState({
            message: '',
            canScan: true,
        });
    };

    validateQRData = (data) => {
        if (data.startsWith('tf:')) {
            return data.slice(3);
        } else {
            return null;
        }
    };

    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };

    render() {
        const { uri, message, canScan, barcodeTypes } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <Button
                            containerStyle={{ borderRadius: 28 }}
                            titleStyle={{ color: Colors.appWhite }}
                            buttonStyle={{ padding: 0, height: 28, width: 28 }}
                            icon={{
                                type: 'ionicon',
                                name: 'ios-arrow-back',
                                size: 28,
                                color: Colors.appWhite,
                            }}
                            onPress={this.props.navigation.goBack}
                            type={'clear'}
                        />
                        <MainText style={styles.title}>Scan QR Code</MainText>
                    </View>
                    {canScan ? (
                        <BaseButton
                            style={styles.QRContainer}
                            onPress={() => this.setState({ canScan: false })}
                        >
                            <BarCodeScanner
                                barCodeTypes={barcodeTypes}
                                onBarCodeScanned={canScan ? this.handleScan : undefined}
                                style={[
                                    StyleSheet.absoluteFill,
                                    { alignItems: 'center', justifyContent: 'center' },
                                ]}
                            />
                        </BaseButton>
                    ) : (
                        <BaseButton style={styles.QRContainer} onPress={this.openCamera}>
                            <Icon name={'camera'} color={Colors.appGreen} style={{ padding: 5 }} />
                            {message ? (
                                <View>
                                    {uri ? (
                                        <Image source={{ uri: uri }} style={styles.image} />
                                    ) : null}
                                    <MainText style={styles.message}>{message}</MainText>
                                </View>
                            ) : (
                                <MainText>Tap to scan</MainText>
                            )}
                        </BaseButton>
                    )}
                    <MainText style={styles.galleryText} onPress={this.openGallery}>
                        Choose from gallery
                    </MainText>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        alignSelf: 'flex-start',

        paddingBottom: 10,
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        textAlign: 'left',
        textAlignVertical: 'center',
        color: Colors.appWhite,
        fontSize: 24,
    },
    QRContainer: {
        width: 300,
        height: 300,
        backgroundColor: Colors.appWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        overflow: 'hidden',
    },
    galleryText: {
        position: 'absolute',
        bottom: 0,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.appWhite,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'center',
    },
    message: {
        textAlign: 'center',
        color: Colors.appRed,
    },
});

export default connect(mapStateToProps)(ScanQR);
