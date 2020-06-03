import React, { Component } from 'react';
import { View, Button, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { Root, Popup } from '../../components/index';
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
                    this.successPopup();
                    console.log('Success');
                })
                .catch((err) => {
                    this.failurePopup();
                    console.log('upload failed: ' + err.message);
                });
        } else {
            this.goBack();
        }
    };

    goBack = () => {
        this.props.navigation.goBack();
    };

    successPopup = () => {
        Popup.show({
            type: 'Success',
            title: 'Upload Success',
            body: 'Press back to return to profile screen',
            showButton: true,
            buttonText: 'Back',
            autoClose: false,
            callback: () => {
                Popup.hide();
                this.goBack();
            },
            verticalOffset: 50,
        });
    };

    failurePopup = () => {
        Popup.show({
            type: 'Failure',
            title: 'Upload Failed',
            body: 'Please try again in a few minutes',
            showButton: true,
            buttonText: 'Close',
            autoClose: false,
            verticalOffset: 50,
        });
    };

    render() {
        return (
            <Root style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: this.state.imgURI }} />
                </View>
                <Button title="Pick an image from camera roll" onPress={this.onPickImagePress} />
                <Button title="Confirm" onPress={this.onConfirm} />
            </Root>
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
