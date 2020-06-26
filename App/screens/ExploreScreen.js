import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import { MAIN_FONT, MainText, UserItem } from '../components';
import { Colors, Layout } from '../constants/index';
import { LinearGradient } from 'expo-linear-gradient';
import { Input, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { withFirebase } from '../config/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class ExploreScreen extends Component {
    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
        }
    };

    renderProfile = (userData) => {
        const { displayName, profileImg, uid, role } = userData;
        return (
            <ListItem
                title={displayName}
                subtitle={role}
                onPress={() => this.goToProfile(uid)}
                containerStyle={{
                    backgroundColor: Colors.appWhite,
                    paddingHorizontal: 5,
                    paddingVertical: 7,
                    borderRadius: 10,
                }}
                leftAvatar={{
                    source: profileImg
                        ? { uri: profileImg }
                        : require('../assets/images/default/profile.png'),
                }}
            />
            // <UserItem
            //     name={displayName}
            //     subtext={role}
            //     profileImg={profileImg}
            //     onPress={() => this.goToProfile(uid)}
            // />
        );
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <MainText style={styles.title}>Explore</MainText>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.searchBarContainer}>
                            <Input
                                style={{ flex: 1 }}
                                testID="searchInput"
                                // value={searchTerm}
                                placeholder={'Type Here...'}
                                autoCorrect={true}
                                renderErrorMessage={false}
                                // onChangeText={this.searchFilter}
                                placeholderTextColor={Colors.appDarkGray}
                                inputStyle={styles.searchBarInput}
                                inputContainerStyle={styles.inputContentContainer}
                                leftIcon={{
                                    type: 'material',
                                    size: 18,
                                    name: 'search',
                                    color: Colors.appDarkGray,
                                }}
                                leftIconContainerStyle={styles.leftIconContainerStyle}
                            />
                        </View>
                        <View style={styles.content}>
                            {this.renderProfile(this.props.userData)}
                        </View>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    title: {
        textAlign: 'left',
        color: Colors.appWhite,
        fontSize: 24,
        left: 30,
    },
    content: {
        justifyContent: 'center',
    },
    floorPlan: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBarContainer: {
        flexDirection: 'column',
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        // borderTopColor: '#e1e1e1',
        // borderBottomColor: '#e1e1e1',
        // backgroundColor: Colors.appWhite,
    },
    searchBarInput: {
        marginLeft: 10,
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    inputContentContainer: {
        borderRadius: 15,
        borderBottomWidth: 0,
        // borderRadius: 3,
        overflow: 'hidden',
        height: 40,
        backgroundColor: Colors.appGray,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
});

export default connect(mapStateToProps)(withFirebase(ExploreScreen));
