import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    Text,
    ImageBackground,
    Picker,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors, Layout } from '../../../constants';
import { withFirebase } from '../../../config/Firebase';
import { MainText, Popup, RadioButton, MAIN_FONT } from '../../../components';
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
        // Changeable:
        // bannerImg: undefined,
        // profileImg: undefined,
        // firstName: undefined,
        // lastName: undefined,
        // role: undefined
        // major: undefined,
        // year: undefined,
        // house: undefined,
        // roomNumber: undefined,
        // aboutText: undefined,
        // moduleCodes: undefined,
        // moduleNames: undefined,

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
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.validateInput}
                    title={'Save'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
            headerLeft: () => (
                <Button
                    containerStyle={{ borderRadius: 28 }}
                    titleStyle={{ color: Colors.appWhite }}
                    buttonStyle={{ padding: 0, height: 28, width: 28 }}
                    icon={{
                        type: 'ionicon',
                        name: 'ios-arrow-back',
                        size: 28,
                        color: Colors.appWhite,
                    }}
                    onPress={this.toggleExitConfirmationPopup}
                    type={'clear'}
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
            aspect: [25, 8],
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
        console.log('starting');
        return ref.put(blob);
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
        // TODO: Check about text for improper words
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

        let promises = [];
        let changes = {};
        let hasChanges = false;

        if (bannerImg) {
            let promise1 = this.uploadImage(bannerImg, 'banner')
                .then(() => {
                    return this.props.firebase
                        .getStorageRef()
                        .child('banner/' + this.props.userData.uid)
                        .getDownloadURL();
                })
                .then((downloadURL) => {
                    console.log('URL: ' + downloadURL);
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
                .then(() => {
                    return this.props.firebase
                        .getStorageRef()
                        .child('profile/' + this.props.userData.uid)
                        .getDownloadURL();
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
                    this.toggleSuccessPopup();
                })
                .catch((error) => {
                    console.log('Profile update error: ' + error.message);
                    this.toggleFailurePopup();
                });
        } else {
            this.toggleSuccessPopup();
        }
    };

    goBackToProfile = () => {
        this.props.navigation.goBack();
    };
    goToModuleEdit = () => {
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

    renderSuccessPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.successPopupVisible}
                title={'Upload Success'}
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
                body={
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
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
                        <View style={{ marginTop: 10 }}>
                            <MainText> Major 1: </MainText>
                            <Picker
                                style={{ width: '100%' }}
                                mode="dropdown"
                                selectedValue={this.state.majorOptions1}
                                onValueChange={(val) => this.setState({ majorOptions1: val })}
                            >
                                <Picker.Item label={'Select your faculty'} value={[]} />
                                {this.state.facultyOptions &&
                                    Object.keys(this.state.facultyOptions).map((key) => {
                                        return (
                                            <Picker.Item
                                                label={key}
                                                value={this.state.facultyOptions[key]}
                                                key={key}
                                            />
                                        );
                                    })}
                            </Picker>
                            <Picker
                                style={{ width: '100%' }}
                                mode="dropdown"
                                selectedValue={this.state.major1 || ''}
                                onValueChange={(val) => this.setState({ major1: val })}
                            >
                                <Picker.Item label={'Select your major'} value={''} />
                                {this.state.majorOptions1.map((item) => {
                                    return <Picker.Item label={item} value={item} key={item} />;
                                })}
                            </Picker>
                        </View>
                        {this.state.majorType !== 'single' && (
                            <View style={{ marginTop: 10 }}>
                                <MainText> Major 2: </MainText>
                                <Picker
                                    style={{ width: '100%' }}
                                    mode="dropdown"
                                    selectedValue={this.state.majorOptions2}
                                    onValueChange={(val) => this.setState({ majorOptions2: val })}
                                >
                                    <Picker.Item label={'Select your faculty'} value={[]} />
                                    {Object.keys(this.state.facultyOptions).map((key) => {
                                        return (
                                            <Picker.Item
                                                label={key}
                                                value={this.state.facultyOptions[key]}
                                                key={key}
                                            />
                                        );
                                    })}
                                </Picker>
                                <Picker
                                    style={{ width: '100%' }}
                                    mode="dropdown"
                                    selectedValue={this.state.major2 || ''}
                                    onValueChange={(val) => this.setState({ major2: val })}
                                >
                                    <Picker.Item label={'Select your major'} value={''} />
                                    {this.state.majorOptions2.map((item) => {
                                        return <Picker.Item label={item} value={item} key={item} />;
                                    })}
                                </Picker>
                            </View>
                        )}
                    </View>
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
                buttonText={'Close'}
                callback={this.toggleMajorEditPopup}
            />
        );
    };
    renderExitConfirmationPopup = () => {
        return (
            <Popup
                imageType={'Warning'}
                isVisible={this.state.exitConfirmationPopupVisible}
                title={'Unsaved changes'}
                body={'You have made changes.\nAre you sure you want to leave?'}
                additionalButtonText={'Yes'}
                additionalButtonCall={() => {
                    this.toggleExitConfirmationPopup();
                    this.goBackToProfile();
                }}
                buttonText={'No'}
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
        } = this.state;
        const moduleCodes =
            this.state.moduleCodes !== undefined
                ? this.state.moduleCodes
                : userData.moduleCodes || [];
        const moduleNames =
            this.state.moduleNames !== undefined
                ? this.state.moduleNames
                : userData.moduleNames || [];
        return (
            <ScrollView style={styles.container}>
                <View>
                    {this.renderSuccessPopup()}
                    {this.renderFailurePopup()}
                    {this.renderMajorEditPopup()}
                    {this.renderExitConfirmationPopup()}

                    <View style={styles.images}>
                        <ImageBackground
                            style={styles.bannerImg}
                            source={
                                bannerImg
                                    ? { uri: bannerImg }
                                    : userData.bannerImg
                                    ? { uri: userData.bannerImg }
                                    : require('../../../assets/images/DefaultBanner.png')
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

                        <Avatar
                            size={80}
                            containerStyle={styles.profileImg}
                            rounded
                            title={userData.displayName[0]}
                            source={
                                profileImg
                                    ? { uri: profileImg }
                                    : userData.profileImg
                                    ? { uri: userData.profileImg }
                                    : require('../../../assets/images/DefaultProfile.png')
                            }
                            showAccessory={true}
                            accessory={{
                                containerStyle: {
                                    bottom: 5,
                                },
                                raised: true,
                                size: 15,
                                name: 'add-a-photo',
                                color: Colors.appGreen,
                            }}
                            // accessory={{
                            //     source: require('../../assets/images/AddPhotoIcon.png'),
                            //     size: 30,
                            // }}
                            onAccessoryPress={this.onChangeProfileImgPress}
                        />
                    </View>

                    <View style={styles.spacing} />
                    <View style={styles.box}>
                        <MainText style={styles.label}>First Name</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your first name'}
                            placeholderTextColor={Colors.appGray}
                            underlineColorAndroid="transparent"
                            value={firstName !== undefined ? firstName : userData.firstName}
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
                            placeholderTextColor={Colors.appGray}
                            underlineColorAndroid="transparent"
                            value={lastName !== undefined ? lastName : userData.lastName}
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
                            placeholderTextColor={Colors.appGray}
                            underlineColorAndroid="transparent"
                            value={role !== undefined ? role : userData.role}
                            autoCapitalize={'words'}
                            onChangeText={this.handleRole}
                        />
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Major</MainText>
                        <MainText onPress={this.toggleMajorEditPopup} style={styles.input}>
                            {major
                                ? major
                                : userData.major || (
                                      <Text style={{ color: Colors.appGray }}>
                                          Select your major
                                      </Text>
                                  )}
                        </MainText>
                    </View>
                    <View style={[styles.box, { paddingRight: 0, height: 40 }]}>
                        <MainText style={styles.label}>Year of Study</MainText>
                        <Picker
                            itemStyle={styles.text}
                            selectedValue={year !== undefined ? year : userData.year || ''}
                            style={styles.picker}
                            onValueChange={this.handleYear}
                            mode={'dropdown'}
                        >
                            <Picker.Item
                                label={'Select year of study'}
                                value={''}
                                color={Colors.appGray}
                            />
                            <Picker.Item label={'Year 1'} value={'Y1'} />
                            <Picker.Item label={'Year 2'} value={'Y2'} />
                            <Picker.Item label={'Year 3'} value={'Y3'} />
                            <Picker.Item label={'Year 4'} value={'Y4'} />
                            <Picker.Item label={'Year 5'} value={'Y5'} />
                        </Picker>
                    </View>
                    <View style={[styles.box, { paddingRight: 0, height: 40 }]}>
                        <MainText style={styles.label}>House</MainText>
                        <Picker
                            itemStyle={styles.text}
                            selectedValue={house !== undefined ? house : userData.house || ''}
                            style={styles.picker}
                            onValueChange={this.handleHouse}
                            mode={'dropdown'}
                        >
                            <Picker.Item
                                label="Select your house"
                                value=""
                                color={Colors.appGray}
                            />
                            <Picker.Item label={'Shan'} value={'Shan'} color={Colors.shanHouse} />
                            <Picker.Item label={'Ora'} value={'Ora'} color={Colors.oraHouse} />
                            <Picker.Item label={'Gaja'} value={'Gaja'} color={Colors.gajaHouse} />
                            <Picker.Item
                                label={'Tancho'}
                                value={'Tancho'}
                                color={Colors.tanchoHouse}
                            />
                            <Picker.Item
                                label={'Ponya'}
                                value={'Ponya'}
                                color={Colors.ponyaHouse}
                            />
                        </Picker>
                    </View>
                    <View style={styles.box}>
                        <MainText style={styles.label}>Room No.</MainText>
                        <TextInput
                            style={styles.input}
                            placeholder={'Add your room number'}
                            maxLength={7}
                            placeholderTextColor={Colors.appGray}
                            underlineColorAndroid="transparent"
                            value={roomNumber !== undefined ? roomNumber : userData.roomNumber}
                            textContentType={'postalCode'}
                            keyboardType={'numeric'}
                            onChangeText={this.handleRoomNumber}
                        />
                    </View>
                    <View style={styles.box2}>
                        <MainText style={[styles.text, { marginBottom: 5 }]}>About</MainText>
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
                            placeholderTextColor={Colors.appGray}
                            underlineColorAndroid="transparent"
                            value={aboutText !== undefined ? aboutText : userData.aboutText}
                            autoCapitalize={'sentences'}
                            onChangeText={this.handleAboutText}
                            autoCorrect={true}
                            textBreakStrategy={'highQuality'}
                        />
                    </View>
                    <View style={styles.box2}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                            }}
                        >
                            <MainText style={styles.text}>
                                Modules that I’ve taken in Tembusu
                            </MainText>
                            <Icon
                                style={{ marginLeft: 'auto' }}
                                size={20}
                                name={'edit'}
                                onPress={this.goToModuleEdit}
                                color={Colors.appDarkGray}
                            />
                        </View>
                        <View>
                            {moduleCodes.length === 0 ? (
                                <ListItem
                                    title={'None'}
                                    titleStyle={{
                                        fontFamily: MAIN_FONT,
                                        color: Colors.appDarkGray,
                                        fontSize: 12,
                                        textAlign: 'center',
                                    }}
                                    containerStyle={{ padding: 0, paddingBottom: 1 }}
                                />
                            ) : (
                                moduleCodes.map((item, index) => (
                                    <ListItem
                                        key={item}
                                        leftElement={<MainText>•</MainText>}
                                        title={`${item} ${moduleNames[index]}`}
                                        titleStyle={[styles.text, { fontSize: 13 }]}
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
    images: {
        position: 'relative',
    },
    bannerImg: {
        width: Layout.window.width,
        height: (Layout.window.width * 8) / 25,
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
        top: (Layout.window.width * 8) / 25 - 40,
        left: 20,
    },
    spacing: {
        height: 45,
    },
    box: {
        borderTopWidth: 1,
        borderTopColor: Colors.appGray,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 40,
        paddingHorizontal: 20,
    },
    box2: {
        borderTopWidth: 1,
        borderTopColor: Colors.appGray,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    aboutText: {
        borderWidth: 1,
        borderColor: Colors.appGray,
        borderRadius: 5,
        textAlignVertical: 'top',
        maxHeight: 80,
        paddingHorizontal: 5,
    },
    label: {
        width: '30%',
        fontSize: 13,
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
    picker: {
        // flex: 1,
        width: '70%',
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: 'normal',
        flexWrap: 'wrap',
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: 'normal',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(ProfileEdit));
