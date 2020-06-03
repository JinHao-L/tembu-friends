import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

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
            headerStyle: {
                backgroundColor: Colors.appGreen,
            },
            headerTintColor: Colors.appWhite,
            headerTitleAlign: 'center',
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
                    <View style={styles.info}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: userData.profilePicture }} />
                        </View>
                        <MainText onPress={this.goToImageEdit}>Choose Image</MainText>
                        <View style={styles.infoText}>
                            <MainText style={styles.infoText}>
                                <Text style={{ color: Colors.appGreen }}>
                                    {userData.displayName}{' '}
                                </Text>
                            </MainText>
                            <MainText style={styles.infoText}>
                                <Text style={{ color: Colors.appRed }}>Tancho</Text> #15-151
                            </MainText>
                            <MainText style={styles.infoText}>Computer Science, Y1</MainText>
                            <MainText style={styles.infoText}>English, Mandarin</MainText>
                        </View>
                    </View>
                    <View style={[styles.box, styles.intro]}>
                        <View style={styles.wallHeader}>
                            <MainText style={[styles.title]}>Why am I in Tembusu?</MainText>
                            <MainText
                                style={[styles.title]}
                                onPress={() =>
                                    Alert.alert('Under Maintenance', 'Feature not available yet')
                                }
                            >
                                Edit
                            </MainText>
                        </View>
                        <MainText>{userData.intro_msg}</MainText>
                    </View>
                    <View style={[styles.box, styles.groups]}>
                        <View style={styles.wallHeader}>
                            <MainText style={[styles.title]}>
                                Interest Groups & Committees that I'm in!
                            </MainText>
                            <MainText
                                style={[styles.title]}
                                onPress={() =>
                                    Alert.alert('Under Maintenance', 'Feature not available yet')
                                }
                            >
                                Edit
                            </MainText>
                        </View>
                        <FlatList
                            data={userData.groups}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row' }}>
                                    <MainText> - </MainText>
                                    <MainText>{item}</MainText>
                                </View>
                            )}
                            keyExtractor={(item) => item}
                        />
                    </View>
                    <View style={[styles.box, styles.modules]}>
                        <View style={styles.wallHeader}>
                            <MainText style={[styles.title]}>
                                Modules that I have taken in Tembusu!
                            </MainText>
                            <MainText
                                style={[styles.title]}
                                onPress={() =>
                                    Alert.alert('Under Maintenance', 'Feature not available yet')
                                }
                            >
                                Edit
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
                            <MainText style={[styles.title]}>My Wall (8)</MainText>
                            <MainText
                                style={[styles.title]}
                                onPress={() =>
                                    Alert.alert('Under Maintenance', 'Feature not available yet')
                                }
                            >
                                See All >
                            </MainText>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={this.state.wall}
                                renderItem={({ item }) => (
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <View style={styles.miniImageContainer}>
                                            <Image
                                                style={styles.miniImage}
                                                source={
                                                    item.id === '1'
                                                        ? require('../../assets/images/profile2.png')
                                                        : require('../../assets/images/profile1.png')
                                                }
                                            />
                                        </View>
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
                    </View>
                </View>
            );
        }
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
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
        height: 110,
    },
    intro: {},
    groups: {
        maxHeight: 120,
    },
    modules: {
        maxHeight: 120,
    },
    wall: {
        flex: 1,
        overflow: 'hidden',
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderRadius: 90 / 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderWidth: 2,
        borderColor: Colors.appGreen,
        borderRadius: 90 / 2,
        overflow: 'hidden',
        marginHorizontal: 30,
        marginVertical: 10,
    },
    miniImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        borderRadius: 28 / 2,
    },
    miniImageContainer: {
        width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: Colors.appGreen,
        borderRadius: 28 / 2,
        overflow: 'hidden',
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
