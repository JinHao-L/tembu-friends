import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MenuButton } from '../../components';
import { Colors } from '../../constants';

class AdminMenu extends Component {
    navigating = false;
    goToReports = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        return this.props.navigation.navigate('Reports');
    };

    goToUsers = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        return this.props.navigation.navigate('Users');
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <ScrollView style={styles.contentContainer}>
                        <MenuButton
                            style={styles.adminButton}
                            textStyle={{ color: Colors.appGreen }}
                            onPress={this.goToUsers}
                        >
                            Users
                        </MenuButton>
                        <MenuButton
                            style={styles.adminButton}
                            textStyle={{ color: Colors.appGreen }}
                            onPress={this.goToReports}
                        >
                            Reported Posts
                        </MenuButton>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 15,
        marginHorizontal: 15,
    },
    adminButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
});

export default AdminMenu;
