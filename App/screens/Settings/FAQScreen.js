import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MainText } from 'components';
import { Colors } from 'constant';

class FAQScreen extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>1. What is TembuFriends?</MainText>
                    <MainText style={styles.normalText}>
                        TembuFriends is a mobile platform for Tembusians to interact in a positive
                        and engaging manner, promoting a friendly, open and welcoming culture in
                        Tembusu College.
                    </MainText>
                </View>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>2. What is the QR Code for?</MainText>
                    <MainText style={styles.normalText}>
                        By scanning other Tembusians’ QR Codes, you are immediately directed to
                        their profile pages without the hassle of searching for them in the Explore
                        Page.
                    </MainText>
                </View>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>3. How do I get verified?</MainText>
                    <MainText style={styles.normalText}>
                        You can approach your Residential Assistants for the verification criteria
                        and request for verification of your account. Once verified, you should see
                        a green tick beside your name in your profile.
                    </MainText>
                </View>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>
                        4. What is the red/ yellow/ green bubble beside my profile picture about?
                    </MainText>
                    <MainText style={styles.normalText}>
                        You can tap on it to set your room status. You can let other Tembusians know
                        if you are in your room (<Text style={styles.greenText}>Green</Text>
                        ), not in your room (<Text style={styles.yellowText}>Yellow</Text>
                        ), or do not wish to be disturbed (<Text style={styles.redText}>Red</Text>
                        ).
                    </MainText>
                </View>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>
                        5. How do I report an offensive post?
                    </MainText>
                    <MainText style={styles.normalText}>
                        At the top right corner of each post, tap on the triple dot icon to report
                        an offensive post. The admins will then review the reported posts on a
                        case-by-case basis.
                    </MainText>
                </View>
                <View style={styles.set}>
                    <MainText style={styles.headerText}>6. How do I change my password?</MainText>
                    <MainText style={styles.normalText}>
                        You can do so by logging out by tapping on the Log Out button in the Menu
                        Page and tapping on “Forgotten Password?” in the Login Page.
                    </MainText>
                </View>
                <View style={[styles.set, { marginBottom: 20 }]}>
                    <MainText style={styles.headerText}>7. How do I delete my account?</MainText>
                    <MainText style={styles.normalText}>
                        You can delete your account through the “Delete Account” button under the
                        Settings Page. Before you do so, let us know how we can improve your
                        experience on this app by sending us a feedback to
                        <Text style={styles.emailText}> tembufriends@gmail.com</Text>!
                    </MainText>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    set: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appGreen,
        paddingBottom: 5,
    },
    normalText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'justify',
    },
    yellowText: {
        color: Colors.statusYellow,
    },
    redText: {
        color: Colors.statusRed,
    },
    greenText: {
        color: Colors.statusGreen,
    },
    emailText: {
        color: Colors.appGreen,
    },
});

export default FAQScreen;
