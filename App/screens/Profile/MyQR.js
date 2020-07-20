import React, { Component } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-elements';
import * as Sharing from 'expo-sharing';
import ViewShot, { captureRef } from 'react-native-view-shot';

import { Colors } from '../../constants';
import { LogoText, MainText } from '../../components';
import { withHeight } from '../../helper/HeaderHeightHook';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class MyQR extends Component {
    constructor(props) {
        super(props);
        this.qrCardRef = React.createRef();
        this.state = {
            ready: false,
        };
    }
    navigating = false;

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    icon={{
                        name: 'share',
                        size: 23,
                        color: Colors.appWhite,
                    }}
                    onPress={this.snapAndShare}
                    type={'clear'}
                    buttonStyle={{ paddingHorizontal: 0, paddingVertical: 5 }}
                    containerStyle={{ borderRadius: 20, marginRight: 10 }}
                    titleStyle={{ color: Colors.appWhite }}
                />
            ),
        });
        this.timer = setTimeout(() => {
            this.setState({
                ready: true,
            });
        }, 500);
    }

    goToScan = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('ScanQR');
    };

    generateQRCode = () => {
        const userData = this.props.userData;
        if (!this.state.ready) {
            return (
                <View
                    style={{
                        width: 250,
                        height: 250,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }
        return (
            <QRCode
                logo={
                    userData
                        ? { uri: userData.profileImg }
                        : require('../../assets/images/logo.png')
                }
                logoSize={50}
                size={250}
                ecl={'Q'}
                backgroundImage={require('../../assets/images/misc/QR_background.jpg')}
                content={'tf:' + userData.uid}
            />
        );
    };

    snapAndShare = () => {
        if (!this.state.ready) {
            return;
        }
        if (this.qrCardRef.current) {
            return captureRef(this.qrCardRef)
                .then((uri) => {
                    console.log('Image saved to', uri);
                    return Sharing.shareAsync('file://' + uri, {
                        mimeType: 'image/png',
                        dialogTitle: 'Add me on TembuFriends!',
                        UTI: 'image/png',
                    });
                })
                .catch((error) => console.log('Snap&Share failed', error));
        }
    };

    render() {
        const userData = this.props.userData;
        if (!userData) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size={'large'} color={Colors.appWhite} />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <ViewShot style={{ marginBottom: 56 / 2 }} ref={this.qrCardRef}>
                        <View style={styles.QRContainer}>
                            {this.generateQRCode()}
                            <LogoText
                                style={styles.logoTitle}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                TEMBU
                                <Text style={styles.logoTitle2} adjustsFontSizeToFit={true}>
                                    FRIENDS
                                </Text>
                            </LogoText>
                            <MainText style={styles.name}>{userData.displayName}</MainText>
                        </View>
                    </ViewShot>
                    <MainText style={styles.hyperlinkText} onPress={this.goToScan}>
                        Scan a QR Code
                    </MainText>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    QRContainer: {
        backgroundColor: Colors.appWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        padding: 15,
    },
    logoTitle: {
        fontSize: 30,
        color: Colors.appGreen,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    logoTitle2: {
        color: Colors.appBlack,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
    },
    hyperlinkText: {
        position: 'absolute',
        bottom: 0,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.appWhite,
        marginBottom: 20,
    },
});

export default withHeight(connect(mapStateToProps)(MyQR));
