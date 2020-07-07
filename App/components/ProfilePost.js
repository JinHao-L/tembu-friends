import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';

import { Colors, Layout } from '../constants';
import { MainText } from './MyAppText';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (timestamp) => {
    if (timestamp) {
        const dateTimeFormat = timestamp.toDate();
        const day = dateTimeFormat.getDate();
        const month = months[dateTimeFormat.getMonth()];

        let hours = dateTimeFormat.getHours();
        let minutes = dateTimeFormat.getMinutes();
        const ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const time = hours + ':' + minutes + ampm;

        return day + ' ' + month + ' at ' + time;
    } else {
        return null;
    }
};

const ProfilePost = ({
    postDetails,
    onUserPress,
    postOptionsVisible = false,
    onPostOptionsPress,
}) => {
    const {
        body,
        is_private,
        //TODO: implement likes
        likes,
        sender_img,
        sender_name,
        sender_uid,
        time_posted,
        post_id,
        imgUrl,
        imgRatio,
    } = postDetails;
    const [expand, setExpand] = useState(false);
    return (
        <View style={[styles.box, is_private && { backgroundColor: Colors.appLightGray }]}>
            <View style={styles.header}>
                <Avatar
                    size={35}
                    rounded
                    title={sender_name[0]}
                    source={
                        sender_img
                            ? { uri: sender_img }
                            : require('../assets/images/default/profile.png')
                    }
                    containerStyle={{
                        marginRight: 10,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.appGray,
                    }}
                    onPress={() => onUserPress(sender_uid)}
                />
                <View style={{ flexDirection: 'column' }}>
                    <MainText style={{ fontSize: 15 }} onPress={() => onUserPress(sender_uid)}>
                        {sender_name}
                    </MainText>
                    <MainText>{formatDate(time_posted)}</MainText>
                </View>
                {is_private && (
                    <MainText
                        style={{
                            alignSelf: 'flex-end',
                            marginLeft: 5,
                            color: Colors.appDarkGray,
                        }}
                    >
                        (Private)
                    </MainText>
                )}
                {postOptionsVisible && (
                    <Icon
                        name={'more-horiz'}
                        size={18}
                        color={Colors.appGreen}
                        containerStyle={{ alignSelf: 'flex-start', marginLeft: 'auto' }}
                        onPress={() => onPostOptionsPress(post_id)}
                    />
                )}
            </View>
            <MainText>{body}</MainText>
            {imgUrl ? (
                <TouchableOpacity
                    style={
                        expand
                            ? undefined
                            : {
                                  maxHeight: Layout.window.height / 2,
                                  overflow: 'hidden',
                              }
                    }
                    onPress={() => {
                        console.log('TAPPED');
                        setExpand(!expand);
                    }}
                    disabled={Layout.window.width / imgRatio <= Layout.window.height / 2}
                >
                    <Image
                        source={{ uri: imgUrl }}
                        style={{
                            marginTop: 5,
                            width: '100%',
                            aspectRatio: imgRatio,
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
    },
    header: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfilePost;
