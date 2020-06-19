import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import { MainText, MenuButton } from '../../components';
import { Colors } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

class AdminScreen extends Component {
    state = {};

    goToModules = () => {
        return this.props.navigation.navigate('Modules');
    };

    goToUsers = () => {
        return this.props.navigation.navigate('Users');
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <MainText style={styles.title}>Admin Privileges</MainText>
                    </View>
                    <View style={styles.contentContainer}>
                        <MenuButton
                            style={styles.adminButton}
                            borderStyle={styles.adminBorderStyle}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToUsers}
                        >
                            Users
                        </MenuButton>
                        <MenuButton
                            style={styles.adminButton}
                            borderStyle={styles.adminBorderStyle}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToModules}
                        >
                            Modules
                        </MenuButton>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 15,
        marginHorizontal: 30,
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 24,
        left: 30,
    },
    adminButton: {
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
    adminBorderStyle: {
        borderWidth: 1,
        borderColor: Colors.appGray,
    },
});

export default AdminScreen;
