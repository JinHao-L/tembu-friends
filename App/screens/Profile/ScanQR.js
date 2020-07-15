import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { LogoText, MainText } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class ScanQR extends Component {
    componentDidMount() {}

    render() {
        const userData = this.props.userData;
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
