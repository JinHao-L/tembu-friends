import React, { Component } from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';

import { MainText } from '../../components';
import { Colors } from '../../constants';

class ContactUsScreen extends Component {
    mailTo = () => {
        return Linking.openURL('mailto:tembufriends@gmail.com');
    };

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/settings/contact-us.png')}
                    style={{ marginBottom: 30, width: 100, height: 76.17 }}
                    resizeMode={'contain'}
                />
                <MainText style={styles.normalText}>Drop us a message at</MainText>
                <MainText style={styles.emailText} onPress={this.mailTo}>
                    tembufriends@gmail.com
                </MainText>
                <MainText style={styles.normalText}>
                    for any enquiries, technical difficulties, ideas on improving the app, and even
                    compliments!
                </MainText>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
    normalText: {
        marginHorizontal: 30,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
    },
    emailText: {
        marginHorizontal: 30,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appGreen,
        textAlign: 'center',
    },
});

export default ContactUsScreen;
