import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';

import { Colors, Layout } from '../../constants';
import { MainText } from '../Commons';
import PostImage from './PostImage';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (timestamp) => {
    if (timestamp) {
        const dateTimeFormat = timestamp.toDate();
        let day = dateTimeFormat.getDate();
        day = day < 10 ? '0' + day : day;
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

function TruncateText({ text, textStyle }) {
    return (
        <ViewMoreText
            numberOfLines={3}
            renderViewMore={(handlePress) => (
                <MainText style={{ color: Colors.appGreen }} onPress={handlePress}>
                    See More
                </MainText>
            )}
            renderViewLess={(handlePress) => (
                <MainText style={{ color: Colors.appGreen }} onPress={handlePress}>
                    See Less
                </MainText>
            )}
        >
            <MainText style={textStyle}>{text}</MainText>
        </ViewMoreText>
    );
}

function ProfilePost({
    postDetails,
    onUserPress = () => null,
    postOptionsVisible = false,
    onPostOptionsPress,
}) {
    const {
        body,
        is_private,
        sender_img,
        sender_name,
        sender_uid,
        time_posted,
        post_id,
        reported = false,
        imgUrl,
        imgRatio,
    } = postDetails;

    return (
        <View style={[styles.box, is_private && { backgroundColor: Colors.appGray1 }]}>
            <View style={styles.header}>
                <Avatar
                    size={35}
                    rounded
                    title={sender_name[0]}
                    source={
                        sender_img
                            ? { uri: sender_img }
                            : require('../../assets/images/default/profile.png')
                    }
                    containerStyle={{
                        marginRight: 10,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.appGray2,
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
                            color: Colors.appGray4,
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
                        onPress={() => onPostOptionsPress(post_id, reported)}
                    />
                )}
            </View>
            <View>
                <TruncateText text={body} />
            </View>
            {imgUrl ? (
                <PostImage
                    imgRatio={imgRatio}
                    imgUrl={imgUrl}
                    style={{ marginTop: 10 }}
                    caption={() => (
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginBottom: 5,
                                    alignItems: 'flex-end',
                                }}
                            >
                                <MainText style={{ fontSize: 15, color: Colors.appWhite }}>
                                    {sender_name}
                                </MainText>
                                <MainText style={{ fontSize: 12, color: Colors.appWhite }}>
                                    {' • '}
                                    {formatDate(time_posted)}
                                </MainText>
                                {is_private && (
                                    <MainText
                                        style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: 5,
                                            color: Colors.appGray4,
                                        }}
                                    >
                                        (Private)
                                    </MainText>
                                )}
                            </View>
                            <ScrollView style={{ maxHeight: Layout.window.height / 2 }}>
                                <TruncateText
                                    text={body}
                                    textStyle={{
                                        textAlign: 'left',
                                        color: Colors.appWhite,
                                    }}
                                />
                            </ScrollView>
                        </View>
                    )}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray2,
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
