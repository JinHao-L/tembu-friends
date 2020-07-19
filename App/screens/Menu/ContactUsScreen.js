import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';

import { MainText } from '../../components';
import { Colors } from '../../constants';
import { updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePermissions: (uid, permission) => {
            dispatch(updateProfile(uid, { pushPermissions: permission }));
        },
    };
};

class ContactUsScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/misc/contactUsIcon.png')}
                    style={{ marginBottom: 30, width: 100, height: 76.17 }}
                />
                <MainText style={styles.normalText}>Drop us a message at</MainText>
                <MainText style={styles.emailText}>tembufriends@gmail.com</MainText>
                <MainText style={styles.normalText}>
                    for any enquiries, technical difficulties, ideas on improving
                </MainText>
                <MainText style={styles.normalText}>the app, and even compliments!</MainText>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.appWhite,
    },
    normalText: {
        marginHorizontal: 30,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
    },
    emailText: {
        marginHorizontal: 30,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appGreen,
        textAlign: 'center',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen);
