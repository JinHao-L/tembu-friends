import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { HeaderBackButton } from '@react-navigation/stack';

import { MainText, Popup, GreenButton } from 'components';
import { Colors, MAIN_FONT } from 'constant';
import { withFirebase } from 'helper/Firebase';

class PostCreate extends Component {
    state = {
        myName: this.props.route.params.myName,
        profileImg: this.props.route.params.profileImg,
        profileData: this.props.route.params.profileData,

        // Post
        body: '',
        postImg: '',
        isPrivate: false,

        // Popup
        discardPostPopupVisible: false,
        uploading: false,
        successPopupVisible: false,
        failurePopupVisible: false,
        editImageVisible: false,
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={this.toggleDiscardPostPopup}
                    labelVisible={false}
                    backImage={() => (
                        <Icon
                            type={'ionicon'}
                            name={'ios-arrow-back'}
                            size={26}
                            color={Colors.appWhite}
                        />
                    )}
                />
            ),
            headerRight: () => (
                <Button
                    onPress={this.uploadPost}
                    title={'Post'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite, fontFamily: MAIN_FONT, fontSize: 18 }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                    disabled={this.state.body === ''}
                    disabledTitleStyle={{ color: Colors.appGray4 }}
                />
            ),
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.body !== this.state.body) {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <Button
                        onPress={this.uploadPost}
                        title={'Post'}
                        type={'clear'}
                        titleStyle={{ color: Colors.appWhite, fontFamily: MAIN_FONT, fontSize: 18 }}
                        containerStyle={{ marginRight: 5, borderRadius: 20 }}
                        disabled={this.state.body === ''}
                        disabledTitleStyle={{ color: Colors.appGray4 }}
                    />
                ),
            });
        }
    }

    uploadImage = async (uri) => {
        if (uri) {
            const response = await fetch(uri);
            const blob = await response.blob();
            const uniqueName = new Date().valueOf();

            let ref = this.props.firebase
                .getStorageRef()
                .child(`posts/${this.state.profileData.uid}/` + uniqueName);
            return ref.put(blob).then(() => ref);
        } else {
            return Promise.resolve();
        }
    };

    uploadPost = () => {
        this.setState({
            uploading: true,
        });

        return this.uploadImage(this.state.postImg)
            .then((ref) => {
                if (ref) {
                    return ref.getDownloadURL();
                } else {
                    return undefined;
                }
            })
            .then((url) => {
                console.log('Got url: ' + url);
                const post = {
                    body: this.state.body,
                    is_private: this.state.isPrivate,
                    receiver_uid: this.state.profileData.uid,
                    sender_img: this.state.profileImg,
                    sender_name: this.state.myName,
                    imgUrl: url,
                    imgRatio: this.state.imgRatio,
                };
                return this.props.firebase.createPost(post, {
                    expoPushToken: this.state.profileData.expoPushToken,
                    pushPermissions: this.state.profileData.pushPermissions,
                });
            })
            .then(() => this.toggleSuccessPopup())
            .catch(() => {
                return this.toggleFailurePopup();
            });
    };

    goBackToProfile = () => {
        this.props.navigation.goBack();
    };

    chooseImg = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to get a profile picture!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: undefined,
        });

        if (!result.cancelled) {
            this.setState({
                postImg: result.uri,
                imgRatio: result.width / result.height,
            });
        }
    };

    handleText = (text) => {
        this.setState({
            body: text,
        });
    };
    togglePrivatePost = () => {
        this.setState({
            isPrivate: !this.state.isPrivate,
        });
    };
    toggleDiscardPostPopup = () => {
        if (this.state.body) {
            this.setState({
                discardPostPopupVisible: !this.state.discardPostPopupVisible,
            });
        } else {
            this.goBackToProfile();
        }
    };
    toggleSuccessPopup = () => {
        if (this.state.uploading) {
            this.setState({
                uploading: false,
            });
        }
        this.setState({
            successPopupVisible: !this.state.successPopupVisible,
        });
    };
    toggleFailurePopup = () => {
        if (this.state.uploading) {
            this.setState({
                uploading: false,
            });
        }
        this.setState({
            failurePopupVisible: !this.state.failurePopupVisible,
        });
    };
    toggleImageEdit = () => {
        this.setState({
            editImageVisible: !this.state.editImageVisible,
        });
    };

    renderDiscardPostPopup = () => {
        return (
            <Popup
                imageType={'Warning'}
                isVisible={this.state.discardPostPopupVisible}
                title={'Discard Post?'}
                body={'If you leave now, this post will be discarded'}
                additionalButtonText={'Discard'}
                additionalButtonCall={() => {
                    this.toggleDiscardPostPopup();
                    this.goBackToProfile();
                }}
                buttonText={'Return to Post'}
                callback={this.toggleDiscardPostPopup}
            />
        );
    };
    renderUploading = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.uploading}
                body={
                    <View
                        style={{
                            paddingVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator size={'large'} />
                        <MainText> Publishing Post</MainText>
                    </View>
                }
                callback={null}
            />
        );
    };
    renderSuccessPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.successPopupVisible}
                title={'Upload Success'}
                body={'Post successfully published'}
                buttonText={'Continue'}
                callback={() => {
                    this.toggleSuccessPopup();
                    this.props.route.params.refetch();
                    return this.goBackToProfile();
                }}
            />
        );
    };
    renderFailurePopup = () => {
        return (
            <Popup
                imageType={'Failure'}
                isVisible={this.state.failurePopupVisible}
                title={'Upload Failed'}
                body={'Please try again in a few seconds.'}
                buttonText={'Close'}
                callback={this.toggleFailurePopup}
            />
        );
    };
    renderImageEdit = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.editImageVisible}
                title={'Edit Picture'}
                body={
                    <View>
                        <Button
                            title={'Change photo'}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'photo-library',
                                color: Colors.appGreen,
                                size: 25,
                                containerStyle: { paddingHorizontal: 20 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => this.chooseImg().then(this.toggleImageEdit)}
                        />
                        <Popup.Separator />
                        <Button
                            title={'Remove photo'}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'delete',
                                color: Colors.appRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 20 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                this.setState({
                                    postImg: '',
                                });
                                this.toggleImageEdit();
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={this.toggleImageEdit}
            />
        );
    };

    render() {
        const { myName, profileImg, profileData, isPrivate, body, postImg } = this.state;
        return (
            <View style={styles.container}>
                {this.renderDiscardPostPopup()}
                {this.renderFailurePopup()}
                {this.renderUploading()}
                {this.renderSuccessPopup()}
                {this.renderImageEdit()}
                <View style={styles.header}>
                    <Avatar
                        size={40}
                        rounded
                        title={myName[0]}
                        source={
                            profileImg
                                ? { uri: profileImg }
                                : require('assets/images/default/profile.png')
                        }
                        containerStyle={styles.avatarStyle}
                    />
                    <MainText style={{ fontSize: 15, paddingTop: 5 }}>{myName}</MainText>
                    <GreenButton
                        containerStyle={styles.privatePostButtonContainer}
                        title={isPrivate ? 'Private' : 'Make Private'}
                        type={isPrivate ? 'solid' : 'outline'}
                        onPress={this.togglePrivatePost}
                        minWidth={90}
                    />
                </View>

                <ScrollView style={styles.content}>
                    <TextInput
                        autoFocus={true}
                        style={styles.input}
                        multiline={true}
                        placeholder={
                            postImg
                                ? 'Write something about this photo...'
                                : `Write a message to ${profileData.firstName}...`
                        }
                        placeholderTextColor={Colors.appGray2}
                        textAlignVertical={'top'}
                        underlineColorAndroid="transparent"
                        value={body}
                        autoCapitalize={'sentences'}
                        onChangeText={this.handleText}
                        autoCorrect={true}
                    />
                    {postImg ? (
                        <TouchableOpacity onPress={this.toggleImageEdit}>
                            <Image
                                source={{ uri: postImg }}
                                style={{
                                    width: '100%',
                                    aspectRatio: this.state.imgRatio,
                                    resizeMode: 'contain',
                                    marginBottom: 5,
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={this.chooseImg}
                            style={styles.imgOptions}
                            accessible
                        >
                            <Icon name={'attachment'} color={Colors.appGray2} />
                            <MainText style={{ color: Colors.appGray2, fontSize: 15 }}>
                                Add an image
                            </MainText>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    header: {
        marginBottom: 5,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 5,
    },
    avatarStyle: {
        marginRight: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.appGray2,
    },
    content: {
        paddingHorizontal: 20,
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
    input: {
        borderWidth: 0,
        paddingTop: 5,
        fontFamily: MAIN_FONT,
        fontSize: 15,
        fontWeight: '100',
        paddingBottom: 20,
    },
    imgOptions: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: Colors.appGray2,
        borderRadius: 5,
        marginBottom: 5,

        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.appWhite,
    },
    privatePostButtonContainer: {
        marginRight: 20,
        marginBottom: 5,
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
});

export default withFirebase(PostCreate);
