import React, { Component } from 'react';
import { View, Button, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { Popup } from '../../components';
import { updateProfilePicture } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return { updateProfilePicture: (uid, url) => dispatch(updateProfilePicture(uid, url)) };
};

class ProfileEditScreen extends Component {
    state = {
        imgURI: this.props.userData.profilePicture,
        isNewPicture: false,
        failurePopupVisible: false,
        successPopupVisible: false,
    };

    onPickImagePress = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to get a profile picture!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({
                imgURI: result.uri,
                isNewPicture: true,
            });
        }
    };

    uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = this.props.firebase.getStorageRef().child('images/' + this.props.userData.uid);
        console.log('starting');
        return ref.put(blob);
    };

    onConfirm = () => {
        if (this.state.isNewPicture) {
            this.uploadImage(this.state.imgURI)
                .then(() => {
                    return this.props.firebase
                        .getStorageRef()
                        .child('images/' + this.props.userData.uid)
                        .getDownloadURL();
                })
                .then((downloadURL) => {
                    console.log('URL: ' + downloadURL);
                    this.props.updateProfilePicture(this.props.userData.uid, downloadURL);
                    this.toggleSuccessPopup();
                    console.log('Success');
                })
                .catch((err) => {
                    this.toggleFailurePopup();
                    console.log('upload failed: ' + err.message);
                });
        } else {
            this.goBack();
        }
    };

    goBack = () => {
        this.props.navigation.goBack();
    };

    toggleSuccessPopup = () => {
        this.setState({
            successPopupVisible: !this.state.successPopupVisible,
        });
    };

    toggleFailurePopup = () => {
        this.setState({
            failurePopupVisible: !this.state.failurePopupVisible,
        });
    };

    renderSuccessPopup = () => {
        return (
            <Popup
                type={'Success'}
                isVisible={this.state.successPopupVisible}
                title={'Upload Success'}
                body={'Press back to return to profile screen\n Close to continue editing'}
                additionalButtonText={'Back'}
                additionalButtonCall={() => {
                    this.toggleSuccessPopup();
                    this.goBack();
                }}
                buttonText={'Close'}
                callback={this.toggleSuccessPopup}
            />
        );
    };

    renderFailurePopup = () => {
        return (
            <Popup
                type={'Failure'}
                isVisible={this.state.failurePopupVisible}
                title={'Upload Failed'}
                body={'Please try again in a few seconds'}
                buttonText={'Close'}
                callback={this.toggleFailurePopup}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderSuccessPopup()}
                {this.renderFailurePopup()}
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: this.state.imgURI }} />
                </View>
                <Button title="Pick an image from camera roll" onPress={this.onPickImagePress} />
                <Button title="Confirm" onPress={this.onConfirm} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(ProfileEditScreen));
