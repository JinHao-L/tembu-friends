import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { MainText, MenuButton } from '../../components';
import { Colors } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';

class AdminMenu extends Component {
    goToReports = () => {
        return this.props.navigation.navigate('Reports');
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
                    <ScrollView style={styles.contentContainer}>
                        <MenuButton
                            style={styles.adminButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToUsers}
                        >
                            Users
                        </MenuButton>
                        <MenuButton
                            style={styles.adminButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToReports}
                        >
                            Reports
                        </MenuButton>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
    },
    contentContainer: {
        paddingTop: 15,
        marginHorizontal: 30,
    },
    title: {
        textAlign: 'left',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 24,
    },
    adminButton: {
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
});

export default AdminMenu;
