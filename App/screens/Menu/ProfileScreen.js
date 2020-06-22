import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button } from 'react-native-elements';

import { MainText } from '../../components';
import { Colors } from '../../constants';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class ProfileScreen extends Component {
    state = {
        wall: [
            {
                id: '1',
                picture: '../../images/profile1.png',
                name: 'Felicia Low',
                message:
                    'It was a pleasure working with you in House Comm! Stay positive and hope you had a great sem ^^',
            },
            {
                id: '2',
                picture: 'images/profile2.png',
                name: 'David Lee',
                message:
                    'Hey bro, thanks for the constant guidance in Com Science! Couldn’t have made it this far without you! Do stay in touch and I hope to see you in the next... ',
            },
        ],
    };

    goToImageEdit = () => {
        return this.props.navigation.navigate('ProfileEdit');
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            // headerStyle: {
            //     backgroundColor: Colors.appGreen,
            // },
            // headerTintColor: Colors.appWhite,
            // headerTitleAlign: 'center',
            headerRight: () => (
                <Button
                    onPress={this.goToImageEdit}
                    title={'Edit'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
        });
    }

    render() {
        const { userData } = this.props;
        if (userData === null) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.state.wall}
                        ListHeaderComponent={
                            <View>
                                <View style={styles.info}>
                                    <Avatar
                                        size={100}
                                        rounded
                                        title={userData.displayName[0]}
                                        source={{ uri: userData.profilePicture }}
                                        containerStyle={styles.imageContainer}
                                    />
                                    <View style={styles.infoText}>
                                        <MainText style={styles.infoText}>
                                            <Text style={{ color: Colors.appGreen }}>
                                                {userData.displayName}{' '}
                                            </Text>
                                        </MainText>
                                        <MainText style={styles.infoText}>
                                            <Text style={{ color: Colors.appRed }}>Tancho</Text>{' '}
                                            #15-151
                                        </MainText>
                                        <MainText style={styles.infoText}>
                                            Computer Science, Y1
                                        </MainText>
                                        <MainText style={styles.infoText}>
                                            English, Mandarin
                                        </MainText>
                                    </View>
                                </View>
                                <View style={[styles.box, styles.intro]}>
                                    <View style={styles.wallHeader}>
                                        <MainText style={[styles.title]}>
                                            Why am I in Tembusu?
                                        </MainText>
                                    </View>
                                    <MainText>{userData.intro_msg}</MainText>
                                </View>
                                <View style={[styles.box, styles.modules]}>
                                    <View style={styles.wallHeader}>
                                        <MainText style={[styles.title]}>
                                            Modules that I have taken in Tembusu!
                                        </MainText>
                                    </View>
                                    <FlatList
                                        data={userData.modules}
                                        renderItem={({ item }) => (
                                            <View style={{ flexDirection: 'row' }}>
                                                <MainText> - </MainText>
                                                <MainText>{item}</MainText>
                                            </View>
                                        )}
                                        keyExtractor={(item) => item}
                                    />
                                </View>
                                <View style={[styles.box, styles.wall]}>
                                    <View style={styles.wallHeader}>
                                        <MainText style={[styles.title]}>My Wall!</MainText>
                                    </View>
                                </View>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={[styles.box, { flexDirection: 'row', marginBottom: 5 }]}>
                                <Avatar
                                    rounded
                                    size={'small'}
                                    containerStyle={styles.miniImageContainer}
                                    source={
                                        item.id === '1'
                                            ? require('../../assets/images/profile2.png')
                                            : require('../../assets/images/profile1.png')
                                    }
                                />
                                <View style={{ flex: 1 }}>
                                    <MainText style={{ color: Colors.appGreen }}>
                                        {item.name}
                                    </MainText>
                                    <MainText>{item.message}</MainText>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            );
        }
    }
}

styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    box: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.appDarkGray,
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 10,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    intro: {},
    groups: {},
    modules: {},
    wall: {},
    imageContainer: {
        borderWidth: 2,
        borderColor: Colors.appGreen,
        marginHorizontal: 30,
        marginVertical: 10,
    },
    miniImageContainer: {
        borderWidth: 1,
        borderColor: Colors.appGreen,
        marginRight: 10,
        marginVertical: 5,
    },
    infoText: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 16,
    },
    title: {
        color: Colors.appGreen,
        fontSize: 13,
        marginBottom: 5,
    },
    wallHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default connect(mapStateToProps)(ProfileScreen);
