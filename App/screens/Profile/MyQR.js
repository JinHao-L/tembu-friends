import React, { Component } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    ActivityIndicator,
    Text,
    TouchableNativeFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { LogoText, MainText } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class MyQR extends Component {
    state = {
        ready: false,
    };

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                ready: true,
            });
        }, 1000);
    }

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
                backgroundImage={require('../../assets/images/QR_background.jpg')}
                content={'tf:' + userData.uid}
            />
        );
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
                        <MainText style={styles.title}>My QR Code</MainText>
                    </View>
                    <TouchableNativeFeedback
                        onPress={() => console.log('pressed')}
                        style={{ borderRadius: 25, overflow: 'hidden' }}
                    >
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
                    </TouchableNativeFeedback>
                    <MainText style={styles.scanText}>Scan a QR Code</MainText>
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
        marginVertical: 'auto',
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
    name: {},
    scanText: {
        position: 'absolute',
        bottom: 0,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.appWhite,
        marginBottom: 20,
    },
});

export default connect(mapStateToProps)(MyQR);
