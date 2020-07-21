import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';

import { Colors, Layout } from '../../constants';
import { MAIN_FONT, MainText } from '../Commons';

const renderHouseText = (house) => {
    let color = Colors.appBlack;
    switch (house) {
        case 'Shan':
            color = Colors.shanHouse;
            break;
        case 'Ora':
            color = Colors.oraHouse;
            break;
        case 'Gaja':
            color = Colors.gajaHouse;
            break;
        case 'Tancho':
            color = Colors.tanchoHouse;
            break;
        case 'Ponya':
            color = Colors.ponyaHouse;
            break;
    }
    return <Text style={{ color: color }}>{house}</Text>;
};

const getStatusColor = (type) => {
    switch (type) {
        case 'green':
            return Colors.statusGreen;
        case 'yellow':
            return Colors.statusYellow;
        case 'red':
            return Colors.statusRed;
        default:
            return Colors.statusYellow;
    }
};

function ProfileHeader({
    userData,
    onAccessoryPress = undefined,
    button = null,
    bottomElement,
    bottomElementStyle,
}) {
    const {
        bannerImg,
        profileImg,
        displayName,
        role = 'Resident',
        major = 'Undeclared',
        year = 'Y0',
        house = 'Undeclared',
        roomNumber = '',
        friendsCount = 0,
        aboutText = "Hello, I'm new to TembuFriends",
        moduleCodes = [],
        moduleNames = [],
        verified,
        statusType,
    } = userData;

    return (
        <View>
            <Image
                style={styles.bannerImg}
                source={
                    bannerImg
                        ? { uri: bannerImg }
                        : require('../../assets/images/default/banner.png')
                }
            />
            <View style={styles.spacing} />
            <View style={styles.avatarContainerStyle}>
                <Avatar
                    size={80}
                    containerStyle={styles.profileImg}
                    rounded
                    source={
                        profileImg
                            ? { uri: profileImg }
                            : require('../../assets/images/default/profile.png')
                    }
                    showAccessory
                    accessory={{
                        color: getStatusColor(statusType),
                        size: 22,
                        name: 'lens',
                        style: {
                            backgroundColor: Colors.appWhite,
                            borderRadius: 50,
                        },
                    }}
                    onAccessoryPress={onAccessoryPress}
                />
                {button}
            </View>
            <View style={[styles.box, { paddingTop: 0 }]}>
                <View style={styles.userDetails}>
                    <MainText style={{ fontSize: 18, color: Colors.appGreen }}>
                        {displayName}
                    </MainText>
                    {verified && (
                        <Image
                            style={{ height: 18, width: 18, marginHorizontal: 5 }}
                            source={require('../../assets/images/profile/verified-icon.png')}
                        />
                    )}
                </View>
                <View style={styles.userDetails}>
                    <Image
                        source={require('../../assets/images/profile/job-icon.png')}
                        style={styles.icon}
                        resizeMode={'contain'}
                    />
                    <MainText style={{ fontSize: 15 }}>{role}</MainText>
                </View>
                <View style={styles.userDetails}>
                    <Image
                        source={require('../../assets/images/profile/study-icon.png')}
                        style={styles.icon}
                        resizeMode={'contain'}
                    />
                    <MainText style={{ fontSize: 15 }}>
                        {major}, {year}
                    </MainText>
                </View>
                <View style={styles.userDetails}>
                    <Image
                        source={require('../../assets/images/profile/house-icon.png')}
                        style={styles.icon}
                        resizeMode={'contain'}
                    />
                    <MainText style={{ fontSize: 15 }}>
                        {renderHouseText(house)} {roomNumber}
                        {roomNumber ? ' ' : ''}• {friendsCount}{' '}
                        {friendsCount <= 1 ? 'Friend' : 'Friends'}
                    </MainText>
                </View>
            </View>
            <View style={styles.box}>
                <MainText style={styles.title}>About</MainText>
                <MainText>{aboutText}</MainText>
            </View>
            <View style={styles.box}>
                <MainText style={styles.title}>Modules that I’ve taken in Tembusu</MainText>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
                    {moduleCodes.length === 0 ? (
                        <MainText style={styles.emptyText}>None</MainText>
                    ) : (
                        moduleCodes.map((item, index) => (
                            <ListItem
                                key={item}
                                leftElement={<MainText>•</MainText>}
                                title={`${item} ${moduleNames[index]}`}
                                titleStyle={{
                                    fontFamily: MAIN_FONT,
                                    fontSize: 13,
                                }}
                                containerStyle={{
                                    padding: 0,
                                    paddingBottom: 1,
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            </View>
            <View style={[styles.box, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <MainText style={styles.title}>Posts</MainText>
            </View>
            {bottomElement ? (
                <View style={[styles.box, bottomElementStyle]}>{bottomElement}</View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    bannerImg: {
        width: Layout.window.width,
        height: Layout.window.width / 3,
        justifyContent: 'flex-end',
    },
    profileImg: {
        backgroundColor: Colors.appWhite,
        borderColor: Colors.appWhite,
        borderWidth: 4,
        marginLeft: 20,
    },
    avatarContainerStyle: {
        position: 'absolute',
        top: Layout.window.width / 3 - 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
    },
    spacing: {
        height: 40,
    },
    userDetails: {
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appGreen,
        marginBottom: 2,
    },
    icon: {
        marginLeft: 3,
        marginRight: 8,
        width: 15,
        height: 15,
    },
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray2,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
    },
    emptyText: {
        fontFamily: MAIN_FONT,
        color: Colors.appGray4,
        fontSize: 12,
        textAlign: 'center',
    },
});

export default ProfileHeader;
