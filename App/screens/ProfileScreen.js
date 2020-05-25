import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '../constants';
import { withFirebase } from '../config/Firebase';
import { AuthButton } from '../components';

class ProfilePage extends Component {
    signOut = async () => {
        try {
            await this.props.firebase.signOut();
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={[
                        styles.box,
                        {
                            width: 80,
                            height: 80,
                            alignSelf: 'center',
                            backgroundColor: Colors.box,
                        },
                    ]}
                >
                    <Text> Ipsum Lorem </Text>
                </View>
                <AuthButton onPress={this.signOut}>Sign Out</AuthButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    box: {
        flex: 0.3,
        justifyContent: 'center',
        borderWidth: 5,
        borderRadius: 20,
        backgroundColor: Colors.box,
    },
    button: {
        padding: 10,
        margin: 15,
        height: 40,
        backgroundColor: Colors.button,
    },
});

export default withFirebase(ProfilePage);
