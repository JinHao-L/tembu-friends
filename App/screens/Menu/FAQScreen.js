import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
            <ScrollView style={styles.container}>
                <MainText style={styles.headerText}>1. What is TembuFriends?</MainText>
                <MainText style={styles.normalText}>
                    TembuFriends is a mobile platform for Tembusians to interact in a positive and
                    engaging manner, promoting a friendly, open and welcoming culture in Tembusu
                    College.
                </MainText>
                <MainText style={styles.headerText}>2. What is the QR Code for?</MainText>
                <MainText style={styles.normalText}>
                    By scanning other Tembusians’ QR Codes, you are immediately directed to their
                    profile pages without the hassle of searching for them in the Explore Page.
                </MainText>
                <MainText style={styles.headerText}>3. How do I get verified?</MainText>
                <MainText style={styles.normalText}>
                    You can approach your Residential Assistants for the verification criteria and
                    request for verification of your account. Once verified, you should see a green
                    tick beside your name in your profile.
                </MainText>
                <MainText style={styles.headerText}>
                    4. What is the red/ yellow/ green bubble beside my profile picture about?
                </MainText>
                <MainText style={styles.normalText}>
                    You can tap on it to set your room status. You can let other Tembusians know if
                    you are in your room (<MainText style={styles.headerText}>Green</MainText>
                    ), not in your room (<MainText style={styles.yellowText}>Yellow</MainText>
                    ), or do not wish to be disturbed (
                    <MainText style={styles.redText}>Red</MainText>
                    ).
                </MainText>
                <MainText style={styles.headerText}>5. How do I report an offensive post?</MainText>
                <MainText style={styles.normalText}>
                    At the top right corner of each post, tap on the triple dot icon to report an
                    offensive post. The admins will then review the reported posts on a case-by-case
                    basis.
                </MainText>
                <MainText style={styles.headerText}>6. How do I change my password?</MainText>
                <MainText style={styles.normalText}>
                    You can do so by logging out by tapping on the Log Out button in the Menu Page
                    and tapping on “Forgotten Password?” in the Login Page.
                </MainText>
                <MainText style={styles.headerText}>7. How do I delete my account?</MainText>
                <MainText style={styles.lastText}>
                    You can delete your account through the “Delete Account” button under the
                    Settings Page. Before you do so, let us know how we can improve your experience
                    on this app by sending us a feedback to
                    <MainText style={styles.greenText}> tembufriends@gmail.com</MainText>!
                </MainText>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: Colors.appWhite,
    },
    headerText: {
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appGreen,
        textAlign: 'left',
    },
    normalText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'justify',
    },
    yellowText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appYellow,
        textAlign: 'justify',
    },
    redText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appRed,
        textAlign: 'justify',
    },
    greenText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appGreen,
        textAlign: 'justify',
    },
    lastText: {
        marginHorizontal: 20,
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'justify',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen);
