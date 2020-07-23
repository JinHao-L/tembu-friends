import React, { Component } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { HeaderBackButton } from '@react-navigation/stack';

import { Colors, Layout } from '../../../constants';
import { withFirebase } from '../../../helper/Firebase';
import { MAIN_FONT, MainText, Popup, RadioButton } from '../../../components';
import { updateProfile } from '../../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return { updateProfile: (uid, changes) => dispatch(updateProfile(uid, changes)) };
};

const wordsOnly = /^[A-Za-z ]+$/;

class ProfileEdit extends Component {
    state = {
        // Major options
        facultyOptions: null,
        majorOptions1: [],
        majorOptions2: [],
        majorType: 'single',

        // Popups
        failurePopupVisible: false,
        successPopupVisible: false,
        majorEditPopupVisible: false,
        exitConfirmationPopupVisible: false,
        errorMessage: null,
        unsavedEdits: false,
        uploading: false,
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={this.toggleExitConfirmationPopup}
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
                    onPress={this.validateInput}
                    title={'Save'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite, fontFamily: MAIN_FONT, fontSize: 18 }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
        });
    }

    onChangeBannerImgPress = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to get a profile picture!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({
                bannerImg: result.uri,
            });
        }
    };
    onChangeProfileImgPress = async () => {
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
                profileImg: result.uri,
            });
        }
    };
    uploadImage = async (uri, type) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = this.props.firebase.getStorageRef().child(`${type}/` + this.props.userData.uid);
        console.log('Uploading', type);
        return ref.put(blob).then(() => ref);
    };

    validateInput = () => {
        this.setState({ errorMessage: null });
        let hasError = false;
        let errorMessage = 'Invalid inputs detected: \n';
        if (
            this.state.firstName !== undefined &&
            (this.state.firstName.length === 0 || !this.state.firstName.match(wordsOnly))
        ) {
            errorMessage += 'first name, ';
            hasError = true;
        }
        if (
            this.state.lastName !== undefined &&
            (this.state.lastName.length === 0 || !this.state.lastName.match(wordsOnly))
        ) {
            errorMessage += 'last name, ';
            hasError = true;
        }

        if (this.state.roomNumber !== undefined && this.state.roomNumber.length !== 7) {
            errorMessage += 'room number, ';
            hasError = true;
        }
        if (hasError) {
            errorMessage = errorMessage.slice(0, errorMessage.length - 2);
            this.setState({ errorMessage }, () => this.toggleFailurePopup());
        } else {
            this.onConfirm();
        }
    };
    onConfirm = () => {
        const {
            bannerImg,
            profileImg,
            firstName,
            lastName,
            role,
            major,
            year,
            house,
            roomNumber,
            aboutText,
            moduleCodes,
            moduleNames,
        } = this.state;
        this.setState({
            uploading: true,
        });
        let promises = [];
        let changes = {};
        let hasChanges = false;

        if (bannerImg) {
            let promise1 = this.uploadImage(bannerImg, 'banner')
                .then((ref) => {
                    return ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    console.log('URL: ', downloadURL);
                    changes.bannerImg = downloadURL;
                    console.log('Banner upload success');
                })
                .catch((err) => {
                    console.log('Banner upload failed: ' + err.message);
                    throw err;
                });
            promises.push(promise1);
            hasChanges = true;
        }
        if (profileImg) {
            let promise2 = this.uploadImage(profileImg, 'profile')
                .then((ref) => {
                    return ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    console.log('URL: ' + downloadURL);
                    changes.profileImg = downloadURL;
                    console.log('Profile upload success');
                })
                .catch((err) => {
                    console.log('Profile upload failed: ' + err.message);
                    throw err;
                });
            promises.push(promise2);
            hasChanges = true;
        }
        if (firstName || lastName) {
            changes.firstName = firstName || this.props.userData.firstName;
            changes.lastName = lastName || this.props.userData.lastName;
            changes.displayName = changes.firstName + ' ' + changes.lastName;
            hasChanges = true;
        }
        if (role !== undefined) {
            changes.role = role;
            hasChanges = true;
        }
        if (major !== undefined) {
            changes.major = major;
            hasChanges = true;
        }
        if (year) {
            changes.year = year;
            hasChanges = true;
        }
        if (house) {
            changes.house = house;
            hasChanges = true;
        }
        if (roomNumber !== undefined) {
            changes.roomNumber = roomNumber;
            hasChanges = true;
        }
        if (aboutText !== undefined) {
            changes.aboutText = aboutText;
            hasChanges = true;
        }
        if (moduleCodes !== undefined) {
            changes.moduleCodes = moduleCodes;
            changes.moduleNames = moduleNames;
            hasChanges = true;
        }
        if (hasChanges) {
            Promise.all(promises)
                .then(() => {
                    this.props.updateProfile(this.props.userData.uid, changes);
                    this.setState({
                        uploading: false,
                    });
                    this.toggleSuccessPopup();
                })
                .catch((error) => {
                    console.log('Profile update error: ' + error.message);
                    this.setState(
                        {
                            uploading: true,
                        },
                        () => this.toggleFailurePopup()
                    );
                });
        } else {
            this.setState({
                uploading: false,
            });
            this.toggleSuccessPopup();
        }
    };

    goBackToProfile = () => {
        this.props.navigation.goBack();
    };
    navigating = false;
    goToModuleEdit = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.navigate('ModuleEdit', {
            moduleCodes: this.state.moduleCodes || this.props.userData.moduleCodes || [],
            moduleNames: this.state.moduleNames || this.props.userData.moduleNames || [],
            setModules: (myModCodes, myModNames) => {
                this.editsDetected();
                this.setState({
                    moduleCodes: myModCodes,
                    moduleNames: myModNames,
                });
            },
        });
    };

    // Popup handlers
    toggleSuccessPopup = () => {
        this.setState({
            successPopupVisible: !this.state.successPopupVisible,
            unsavedEdits: false,
        });
    };
    toggleFailurePopup = () => {
        this.setState({
            failurePopupVisible: !this.state.failurePopupVisible,
        });
    };
    toggleMajorEditPopup = () => {
        if (this.state.facultyOptions === null) {
            this.props.firebase.getCourses().then((data) =>
                this.setState({
                    facultyOptions: data,
                })
            );
        }
        this.setState({
            majorEditPopupVisible: !this.state.majorEditPopupVisible,
        });
    };
    toggleExitConfirmationPopup = () => {
        if (this.state.unsavedEdits) {
            this.setState({
                exitConfirmationPopupVisible: !this.state.exitConfirmationPopupVisible,
            });
        } else {
            this.goBackToProfile();
        }
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
                        <MainText>Saving your changes</MainText>
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
                title={'Successfully Saved'}
                body={'Press back to return to profile screen. Close to continue editing.'}
                additionalButtonText={'My Profile'}
                additionalButtonCall={() => {
                    this.toggleSuccessPopup();
                    this.goBackToProfile();
                }}
                buttonText={'Close'}
                callback={this.toggleSuccessPopup}
            />
        );
    };
    renderFailurePopup = () => {
        return (
            <Popup
                imageType={'Failure'}
                isVisible={this.state.failurePopupVisible}
                title={'Save Failed'}
                body={this.state.errorMessage || 'Please try again in a few seconds.'}
                buttonText={'Close'}
                callback={this.toggleFailurePopup}
            />
        );
    };
    renderMajorEditPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.majorEditPopupVisible}
                title={'Major Selection'}
                body={
                    !this.state.facultyOptions ? (
                        <View style={{ minHeight: 50, justifyContent: 'center' }}>
                            <ActivityIndicator color={Colors.appGreen} />
                        </View>
                    ) : (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    marginVertical: 5,
                                }}
                            >
                                <RadioButton
                                    selected={this.state.majorType === 'single'}
                                    onPress={() => this.setState({ majorType: 'single' })}
                                    tintColor={Colors.appLightGreen}
                                    text={'Single Major'}
                                />
                                <RadioButton
                                    selected={this.state.majorType === 'dblMajor'}
                                    onPress={() => this.setState({ majorType: 'dblMajor' })}
                                    tintColor={Colors.appLightGreen}
                                    text={'Double Major'}
                                />
                                <RadioButton
                                    selected={this.state.majorType === 'ddp'}
                                    onPress={() => this.setState({ majorType: 'ddp' })}
                                    tintColor={Colors.appLightGreen}
                                    text={'Double Degree'}
                                />
                            </View>
                            {this.state.majorType !== 'single' && <Popup.Separator />}
                            <View style={{ marginTop: 5, paddingLeft: 10 }}>
                                {this.state.majorType !== 'single' && (
                                    <MainText> Major 1: </MainText>
                                )}
                                <RNPickerSelect
                                    value={this.state.majorOptions1}
                                    placeholder={{
                                        label: 'Select your faculty',
                                        value: [],
                                        color: Colors.appGray2,
                                    }}
                                    items={Object.keys(this.state.facultyOptions).map((key) => {
                                        return {
                                            label: key,
                                            value: this.state.facultyOptions[key],
                                            color: Colors.appBlack,
                                        };
                                    })}
                                    onValueChange={(val) => this.setState({ majorOptions1: val })}
                                    useNativeAndroidPickerStyle={false}
                                    Icon={() => (
                                        <Icon
                                            name={'arrow-drop-down'}
                                            size={26}
                                            color={Colors.appGray5}
                                        />
                                    )}
                                    style={pickerSelectStyles}
                                />
                                <RNPickerSelect
                                    value={this.state.major1 || ''}
                                    placeholder={{
                                        label: 'Select your major',
                                        value: '',
                                        color: Colors.appGray2,
                                    }}
                                    items={this.state.majorOptions1.map((item) => {
                                        return {
                                            label: item,
                                            value: item,
                                            color: Colors.appBlack,
                                        };
                                    })}
                                    onValueChange={(val) => this.setState({ major1: val })}
                                    useNativeAndroidPickerStyle={false}
                                    Icon={() => (
                                        <Icon
                                            name={'arrow-drop-down'}
                                            size={26}
                                            color={Colors.appGray5}
                                        />
                                    )}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            {this.state.majorType !== 'single' && <Popup.Separator />}
                            {this.state.majorType !== 'single' && (
                                <View style={{ marginTop: 5, paddingLeft: 10 }}>
                                    <MainText> Major 2: </MainText>
                                    <RNPickerSelect
                                        value={this.state.majorOptions2}
                                        placeholder={{
                                            label: 'Select your faculty',
                                            value: [],
                                            color: Colors.appGray2,
                                        }}
                                        items={Object.keys(this.state.facultyOptions).map((key) => {
                                            return {
                                                label: key,
                                                value: this.state.facultyOptions[key],
                                                color: Colors.appBlack,
                                            };
                                        })}
                                        onValueChange={(val) =>
                                            this.setState({ majorOptions2: val })
                                        }
                                        useNativeAndroidPickerStyle={false}
                                        Icon={() => (
                                            <Icon
                                                name={'arrow-drop-down'}
                                                size={26}
                                                color={Colors.appGray5}
                                            />
                                        )}
                                        style={pickerSelectStyles}
                                    />
                                    <RNPickerSelect
                                        value={this.state.major2 || ''}
                                        placeholder={{
                                            label: 'Select your major',
                                            value: '',
                                            color: Colors.appGray2,
                                        }}
                                        items={this.state.majorOptions2.map((item) => {
                                            return {
                                                label: item,
                                                value: item,
                                                color: Colors.appBlack,
                                            };
                                        })}
                                        onValueChange={(val) => this.setState({ major2: val })}
                                        useNativeAndroidPickerStyle={false}
                                        Icon={() => (
                                            <Icon
                                                name={'arrow-drop-down'}
                                                size={26}
                                                color={Colors.appGray5}
                                            />
                                        )}
                                        style={pickerSelectStyles}
                                    />
                                </View>
                            )}
                        </View>
                    )
                }
                additionalButtonText={'Save'}
                additionalButtonCall={() => {
                    this.editsDetected();
                    let major = this.state.major1;
                    if (this.state.majorType !== 'single' && this.state.major2) {
                        major += ' & ' + this.state.major2;
                    }
                    this.setState({
                        major: major,
                    });
                    this.toggleMajorEditPopup();
                }}
                buttonText={'Cancel'}
                callback={this.toggleMajorEditPopup}
            />
        );
    };
    renderExitConfirmationPopup = () => {
        return (
            <Popup
                imageType={'Warning'}
                isVisible={this.state.exitConfirmationPopupVisible}
                title={'Discard Edits'}
                body={'If you leave now, the edits you made will be discarded'}
                additionalButtonText={'Discard'}
                additionalButtonCall={() => {
                    this.toggleExitConfirmationPopup();
                    this.goBackToProfile();
                }}
                buttonText={'Continue Editing'}
                callback={this.toggleExitConfirmationPopup}
            />
        );
    };

    // Inputs handler
    editsDetected = () => {
        if (!this.state.unsavedEdits) {
            this.setState({ unsavedEdits: true });
        }
    };
    handleFirstName = (text) => {
        this.editsDetected();
        this.setState({ firstName: text });
    };
    handleLastName = (text) => {
        this.editsDetected();
        this.setState({ lastName: text });
    };
    handleYear = (value) => {
        this.editsDetected();
        this.setState({ year: value });
    };
    handleHouse = (value) => {
        this.editsDetected();
        this.setState({ house: value });
    };
    handleRoomNumber = (room) => {
        this.editsDetected();
        if (room.length > 0 && room.charAt(0) !== '#') {
            room = '#' + room;
        }
        if (room.length === 3) {
            if (this.state.roomNumber.charAt(3) === '-') {
                this.setState({ roomNumber: room });
            }
        } else if (room.length >= 3 && room.charAt(3) !== '-') {
            room = room.slice(0, 3) + '-' + room.slice(3, 6);
            this.setState({
                roomNumber: room,
            });
        }

        this.setState({ roomNumber: room });
    };
    handleAboutText = (text) => {
        this.editsDetected();
        this.setState({ aboutText: text });
    };
    handleRole = (text) => {
        this.editsDetected();
        this.setState({ role: text });
    };

    render() {
        const { userData } = this.props;
        const {
            bannerImg = userData.bannerImg,
            profileImg = userData.profileImg,
            firstName = userData.firstName,
            lastName = userData.lastName,
            role = userData.role,
            major = userData.major || '',
            year = userData.year || '',
            house = userData.house || '',
            roomNumber = userData.roomNumber,
            aboutText = userData.aboutText,
            moduleCodes = userData.moduleCodes || [],
            moduleNames = userData.moduleNames || [],
        } = this.state;
        let houseColor = Colors.appBlack;
        switch (house) {
            case 'Shan':
                houseColor = Colors.shanHouse;
                break;
            case 'Ora':
                houseColor = Colors.oraHouse;
                break;
            case 'Gaja':
                houseColor = Colors.gajaHouse;
                break;
            case 'Tancho':
                houseColor = Colors.tanchoHouse;
                break;
            case 'Ponya':
                houseColor = Colors.ponyaHouse;
                break;
        }
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
                <View>
                    {this.renderUploading()}
                    {this.renderSuccessPopup()}
                    {this.renderFailurePopup()}
                    {this.renderMajorEditPopup()}
                    {this.renderExitConfirmationPopup()}

                    <ImageBackground
                        style={styles.bannerImg}
                        source={
                            bannerImg
                                ? { uri: bannerImg }
                                : require('../../../assets/images/default/banner.png')
                        }
                    >
                        <Icon
                            containerStyle={styles.addBannerIcon}
                            raised
                            size={15}
                            name={'add-a-photo'}
                            onPress={this.onChangeBannerImgPress}
                            color={Colors.appGreen}
                        />
                    </ImageBackground>

                    <View style={styles.spacing} />
                    <Avatar
                        size={80}
                        containerStyle={styles.profileImg}
                        rounded
                        title={userData.displayName[0]}
                        source={
                            profileImg
                                ? { uri: profileImg }
                                : require('../../../assets/images/default/profile.png')
                        }
                        showAccessory={true}
                        accessory={{
                            containerStyle: {
                                bottom: 5,
                            },
                            raised: true,
                            size: 12,
                            name: 'add-a-photo',
                            color: Colors.appGreen,
                            overlayColor: Colors.appWhite,
                            onPress: this.onChangeProfileImgPress,
                        }}
                    />

                    <View style={styles.box}>
                        <MainText style={styles.label}>First Name</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your first name'}
                            placeholderTextColor={Colors.appGray2}
                            underlineColorAndroid="transparent"
                            value={firstName}
                            textContentType={'name'}
                            autoCapitalize={'words'}
                            onChangeText={this.handleFirstName}
                        />
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Last Name</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your last name'}
                            placeholderTextColor={Colors.appGray2}
                            underlineColorAndroid="transparent"
                            value={lastName}
                            textContentType={'name'}
                            autoCapitalize={'words'}
                            onChangeText={this.handleLastName}
                        />
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Role</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your role in college'}
                            placeholderTextColor={Colors.appGray2}
                            underlineColorAndroid="transparent"
                            value={role}
                            autoCapitalize={'words'}
                            onChangeText={this.handleRole}
                        />
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Major</MainText>
                        <MainText onPress={this.toggleMajorEditPopup} style={styles.input}>
                            {major || (
                                <Text style={{ color: Colors.appGray2 }}>Select your major</Text>
                            )}
                        </MainText>
                    </View>
                    <View style={[styles.box, { paddingRight: 0, height: 40 }]}>
                        <MainText style={styles.label}>Year of Study</MainText>
                        <RNPickerSelect
                            value={year}
                            placeholder={{
                                label: 'Select year of study',
                                value: '',
                                color: Colors.appGray2,
                            }}
                            items={[
                                { label: 'Year 1', value: 'Y1', color: Colors.appBlack },
                                { label: 'Year 2', value: 'Y2', color: Colors.appBlack },
                                { label: 'Year 3', value: 'Y3', color: Colors.appBlack },
                                { label: 'Year 4', value: 'Y4', color: Colors.appBlack },
                                { label: 'Year 5', value: 'Y5', color: Colors.appBlack },
                            ]}
                            onValueChange={this.handleYear}
                            Icon={() => (
                                <Icon name={'arrow-drop-down'} size={26} color={Colors.appGray5} />
                            )}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                inputAndroidContainer: {
                                    width: (Layout.window.width / 10) * 7 - 15,
                                },
                                inputIOSContainer: {
                                    width: (Layout.window.width / 10) * 7 - 15,
                                },
                            }}
                        />
                    </View>
                    <View style={[styles.box, { paddingRight: 0, height: 40 }]}>
                        <MainText style={styles.label}>House</MainText>
                        <RNPickerSelect
                            value={house}
                            placeholder={{
                                label: 'Select your house',
                                value: '',
                                color: Colors.appGray2,
                            }}
                            items={[
                                { label: 'Shan', value: 'Shan', color: Colors.shanHouse },
                                { label: 'Ora', value: 'Ora', color: Colors.oraHouse },
                                { label: 'Gaja', value: 'Gaja', color: Colors.gajaHouse },
                                { label: 'Tancho', value: 'Tancho', color: Colors.tanchoHouse },
                                { label: 'Ponya', value: 'Ponya', color: Colors.ponyaHouse },
                            ]}
                            onValueChange={this.handleHouse}
                            Icon={() => (
                                <Icon name={'arrow-drop-down'} size={26} color={Colors.appGray5} />
                            )}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                inputAndroid: {
                                    ...pickerSelectStyles.inputAndroid,
                                    color: houseColor,
                                },
                                inputIOS: {
                                    ...pickerSelectStyles.inputIOS,
                                    color: houseColor,
                                },
                                inputAndroidContainer: {
                                    width: (Layout.window.width / 10) * 7 - 15,
                                },
                                inputIOSContainer: {
                                    width: (Layout.window.width / 10) * 7 - 15,
                                },
                            }}
                        />
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Room No.</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your room number'}
                            maxLength={7}
                            placeholderTextColor={Colors.appGray2}
                            underlineColorAndroid="transparent"
                            value={roomNumber}
                            textContentType={'postalCode'}
                            keyboardType={'numeric'}
                            onChangeText={this.handleRoomNumber}
                        />
                    </View>
                    <View style={styles.largeBox}>
                        <MainText style={[styles.largeBoxLabel, { marginBottom: 5 }]}>
                            About
                        </MainText>
                        <View style={styles.aboutTextContainer}>
                            <TextInput
                                style={styles.aboutText}
                                multiline={true}
                                numberOfLines={4}
                                placeholder={
                                    'You can share why you are here in Tembusu, ' +
                                    'Interest Groups/ Committees that you are in, ' +
                                    'or anything that you’re interested in! It’s a ' +
                                    'great way to introduce yourself to others!'
                                }
                                placeholderTextColor={Colors.appGray2}
                                underlineColorAndroid="transparent"
                                value={aboutText}
                                autoCapitalize={'sentences'}
                                onChangeText={this.handleAboutText}
                                autoCorrect={true}
                                textAlignVertical={'top'}
                                textBreakStrategy={'simple'}
                            />
                        </View>
                    </View>
                    <View style={styles.largeBox}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                            }}
                        >
                            <MainText style={styles.largeBoxLabel}>
                                Modules that I’ve taken in Tembusu
                            </MainText>
                            <Icon
                                style={{ marginLeft: 'auto' }}
                                size={20}
                                name={'add'}
                                onPress={this.goToModuleEdit}
                                color={Colors.appGray4}
                            />
                        </View>
                        <View>
                            {moduleCodes.length === 0 ? (
                                <MainText
                                    style={{
                                        fontFamily: MAIN_FONT,
                                        color: Colors.appGray4,
                                        fontSize: 12,
                                        textAlign: 'center',
                                        paddingBottom: 1,
                                    }}
                                >
                                    None
                                </MainText>
                            ) : (
                                moduleCodes.map((item, index) => (
                                    <ListItem
                                        key={item}
                                        leftElement={<MainText>•</MainText>}
                                        title={`${item} ${moduleNames[index]}`}
                                        titleStyle={styles.text}
                                        containerStyle={{ padding: 0, paddingBottom: 1 }}
                                    />
                                ))
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    bannerImg: {
        width: Layout.window.width,
        height: Layout.window.width / 3,
        justifyContent: 'flex-end',
    },
    addBannerIcon: {
        alignSelf: 'flex-end',
    },
    profileImg: {
        backgroundColor: Colors.appWhite,
        borderColor: Colors.appWhite,
        borderWidth: 4,
        position: 'absolute',
        top: Layout.window.width / 3 - 40,
        left: 20,
    },
    spacing: {
        height: 45,
    },
    box: {
        borderTopWidth: 1,
        borderTopColor: Colors.appGray2,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 40,
        paddingHorizontal: 20,
    },
    largeBox: {
        borderTopWidth: 1,
        borderTopColor: Colors.appGray2,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    aboutTextContainer: {
        borderWidth: 1,
        borderColor: Colors.appGray2,
        borderRadius: 5,
        maxHeight: 80,
        paddingHorizontal: 5,
    },
    aboutText: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    label: {
        width: '30%',
        fontSize: 15,
    },
    largeBoxLabel: {
        fontSize: 15,
    },
    input: {
        width: '70%',
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
        paddingHorizontal: 0,
        marginLeft: 15,
        flexWrap: 'wrap',
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 13,
        fontFamily: MAIN_FONT,
        fontWeight: '100',
        paddingVertical: 12,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: Colors.appBlack,
        alignItems: 'center',
    },
    inputAndroid: {
        fontSize: 13,
        fontFamily: MAIN_FONT,
        fontWeight: '100',
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingRight: 30,
        color: Colors.appBlack,
        alignItems: 'center',
    },
    placeholder: {
        fontSize: 13,
        fontFamily: MAIN_FONT,
        fontWeight: '100',
    },
    iconContainer: { top: 7, right: 12 },
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(ProfileEdit));
