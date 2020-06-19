import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Text,
    FlatList,
    ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors, Layout } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { MainText, Popup, RadioButton, MAIN_FONT } from '../../components';
import { updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return { updateProfile: (uid, changes) => dispatch(updateProfile(uid, changes)) };
};

const wordsOnly = /^[A-Za-z ]+$/;

class ProfileEditScreen extends Component {
    state = {
        // Changeable:
        // bannerImg: undefined,
        // profileImg: undefined,
        // firstName: undefined,
        // lastName: undefined,
        // major: undefined,
        // year: undefined,
        // house: undefined,
        // roomNumber: undefined,
        // aboutText: undefined,
        // modules: undefined,

        // Major options
        facultyOptions: null,
        majorOptions1: [],
        majorOptions2: [],
        majorType: 'single',

        // Popups
        failurePopupVisible: false,
        successPopupVisible: false,
        majorEditPopupVisible: false,
        errorMessage: null,
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
            aspect: [16, 9],
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
        if (this.state.roomNumber && this.state.roomNumber.length !== 7) {
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
            major,
            year,
            house,
            roomNumber,
            aboutText,
            modules,
        } = this.state;

        let promises = [];
        let changes = {};
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
        }
        if (firstName || lastName) {
            changes.firstName = firstName || this.props.userData.firstName;
            changes.lastName = lastName || this.props.userData.lastName;
            changes.displayName = changes.firstName + ' ' + changes.lastName;
        }
        if (major !== undefined) {
            changes.major = major;
        }
        if (year) {
            changes.year = year;
        }
        if (house) {
            changes.house = house;
        }
        if (roomNumber !== undefined) {
            changes.roomNumber = roomNumber;
        }
        if (aboutText !== undefined) {
            changes.aboutText = aboutText;
        }
        if (modules !== undefined) {
            changes.modules = modules;
        }

        Promise.all(promises)
            .then(() => {
                console.log(changes);
                this.props.updateProfile(this.props.userData.uid, changes);
                this.toggleSuccessPopup();
            })
            .catch((error) => this.toggleFailurePopup());
    };

    goBackToProfile = () => {
        this.props.navigation.goBack();
    };
    goToModuleEdit = () => {
        this.props.navigation.navigate('ModuleEdit', {
            modules: this.state.modules || this.props.userData.modules || [],
            setModules: (myMods) => {
                this.setState({ modules: myMods });
            },
        });
    };

    // Popup handlers
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

    renderSuccessPopup = () => {
        return (
            <Popup
                type={'Success'}
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
                type={'Failure'}
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
                type={'Simple'}
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

    // Inputs handler
    handleFirstName = (text) => {
        this.setState({ firstName: text });
    };
    handleLastName = (text) => {
        this.setState({ lastName: text });
    };
    handleYear = (value) => {
        this.setState({ year: value });
    };
    handleHouse = (value) => {
        this.setState({ house: value });
    };
    handleRoomNumber = (room) => {
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
        this.setState({ aboutText: text });
    };

    render() {
        const { userData } = this.props;
        const {
            bannerImg,
            profileImg,
            firstName,
            lastName,
            major,
            year,
            house,
            roomNumber,
            aboutText,
            modules,
        } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View>
                    {this.renderSuccessPopup()}
                    {this.renderFailurePopup()}
                    {this.renderMajorEditPopup()}

                    <View style={styles.images}>
                        <ImageBackground
                            style={styles.bannerImg}
                            source={
                                bannerImg
                                    ? { uri: bannerImg }
                                    : userData.bannerImg
                                    ? { uri: userData.bannerImg }
                                    : require('../../assets/images/DefaultBanner.png')
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
                                    : require('../../assets/images/DefaultProfile.png')
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
                            value={aboutText || userData.aboutText}
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
                            <MainText>Modules that I’ve taken in Tembusu</MainText>
                            <Icon
                                style={{ marginLeft: 'auto' }}
                                size={20}
                                name={'edit'}
                                onPress={this.goToModuleEdit}
                                color={Colors.appDarkGray}
                            />
                        </View>
                        <FlatList
                            data={modules || userData.modules}
                            renderItem={({ item }) => (
                                <ListItem
                                    title={`• ${item.moduleCode} ${item.title}`}
                                    titleStyle={[styles.text, { fontSize: 13 }]}
                                    containerStyle={{ padding: 0, paddingBottom: 2 }}
                                />
                            )}
                            keyExtractor={(item) => item.moduleCode}
                            ListEmptyComponent={() => (
                                <MainText
                                    style={{
                                        color: Colors.appDarkGray,
                                        fontSize: 12,
                                        textAlign: 'center',
                                    }}
                                >
                                    None
                                </MainText>
                            )}
                        />
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
    },
    input: {
        width: '70%',
        fontFamily: MAIN_FONT,
        fontSize: 14,
        fontWeight: '100',
        paddingHorizontal: 0,
        marginLeft: 15,
        flexWrap: 'wrap',
    },
    picker: {
        // flex: 1,
        width: '70%',
        fontFamily: MAIN_FONT,
        fontSize: 14,
        fontWeight: 'normal',
        flexWrap: 'wrap',
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
        fontWeight: 'normal',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(ProfileEditScreen));
