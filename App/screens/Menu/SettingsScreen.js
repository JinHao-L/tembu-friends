import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

import { MainText, MenuButton, Popup } from '../../components';
import { Colors } from '../../constants';
import { updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData, friendSubscriber: state.friendSubscriber };
};

const mapDispatchToProps = (dispatch) => {
    return {
        //TODO
        updateStatus: (uid, status) => {
            dispatch(updateProfile(uid, { statusType: status }));
        },
    };
};

class SettingsScreen extends Component {
    state = {
        signOutVisible: false,
    };

    goToDelete = () => {
        this.props.navigation.push('Delete');
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
                            style={styles.settingsButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToDelete}
                        >
                            Delete account
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
    settingsButton: {
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
