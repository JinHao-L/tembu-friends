import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature, Layout } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText } from '../../components';
import { Popup, Root } from '../../components/Popup';

const wordsOnly = /^[A-Za-z]+$/;
const passwordFormat = /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/;

class SignUpScreen extends Component {
    state = {
        // Details
        firstName: '',
        lastName: '',
        nusEmail: '',
        password: '',
        confirmPassword: '',

        // Control - errors
        firstNameError: '',
        lastNameError: '',
        emailError: '',
        passwordError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        passwordIcon: 'ios-eye',
        passwordHidden: true,
        confirmPasswordIcon: 'ios-eye',
        confirmPasswordHidden: true,
        keyboardShown: false,
        keyboardHeight: 0,
    };

    clearInputs() {
        this.setState({
            firstName: '',
            lastName: '',
            nusEmail: '',
            password: '',
            confirmPassword: '',
        });
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this)
        );
    }

    _keyboardDidShow(event) {
        console.log('Keyboard Shown');
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    }

    _keyboardDidHide() {
        console.log('Keyboard Hidden');
        this.setState({
            keyboardShown: false,
        });
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onSignUpSuccess() {
        this.emailSentPopup();
        this.setState({
            firstName: '',
            lastName: '',
            nusEmail: '',
            password: '',
            confirmPassword: '',
        });
    }

    onSignUpFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
            // Indicates the email used to attempt a sign up is already in use.
            this.setState({ emailError: 'Account already exists, try logging in instead' });
        } else if (errorCode === 'auth/invalid-email') {
            // Indicates the email is invalid.
            this.setState({ emailError: 'Invalid email address' });
        } else if (errorCode === 'auth/too-many-requests') {
            // Indicates that too many requests were made to a server method.
            this.setState({ generalError: 'Server overloaded. Please try again later' });
        } else if (errorCode === 'auth/network-request-failed') {
            // Indicates network error
            this.setState({ generalError: 'Network error' });
        } else if (errorCode === 'auth/weak-password') {
            this.setState({ passwordError: 'Weak password' });
        } else {
            // Others
            this.setState({ generalError: 'Unknown error' });
            console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
        }
    }

    goToSignIn() {
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('SignIn');
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordHidden: !prevState.passwordHidden,
        }));
    }
    handleConfirmPasswordVisibility() {
        this.setState((prevState) => ({
            confirmPasswordIcon:
                prevState.confirmPasswordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            confirmPasswordHidden: !prevState.confirmPasswordHidden,
        }));
    }

    handleFirstName(text) {
        this.setState({ firstName: text });
    }
    handleLastName(text) {
        this.setState({ lastName: text });
    }
    handleEmail(text) {
        this.setState({ nusEmail: text });
    }
    handlePassword(text) {
        this.setState({
            password: text,
            passwordError: '',
        });
    }
    handleConfirmPassword(text) {
        this.setState({ confirmPassword: text });
    }

    clearFirstNameError() {
        this.setState({
            firstNameError: '',
            generalError: '',
        });
    }
    clearLastNameError() {
        this.setState({
            lastNameError: '',
            generalError: '',
        });
    }
    clearEmailError() {
        this.setState({
            emailError: '',
            generalError: '',
        });
    }
    clearPasswordError() {
        this.setState({
            passwordError: '',
            generalError: '',
        });
    }

    async signUp() {
        const { nusEmail, password, firstName, lastName } = this.state;
        this.setState({ isLoading: true });

        try {
            const response = await this.props.firebase.signUpWithEmail(nusEmail, password);
            if (response && response.user) {
                const imageUrl = await this.props.firebase.defaultImage();
                const userData = {
                    email: nusEmail,
                    firstName,
                    lastName,
                    displayName: firstName + ' ' + lastName,
                    groups: [],
                    intro_msg: 'Hi, I am new to TembuFriends!',
                    modules: [],
                    profilePicture: imageUrl,
                    uid: response.user.uid,
                };
                console.log('starting creation process');
                await response.user.updateProfile({ displayName: firstName + ' ' + lastName });
                console.log('update display name');
                await this.props.firebase.createNewUser(userData);
                console.log('creating new user');
                await response.user.sendEmailVerification();
                console.log('send email verification');
                await this.props.firebase.signOut();
                console.log('sign out');
                this.onSignUpSuccess.bind(this)();
            }
        } catch (error) {
            this.onSignUpFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateInputAndSignUp() {
        Keyboard.dismiss();
        const {
            password,
            confirmPassword,
            firstName,
            lastName,
            nusEmail,
            passwordError,
            isLoading,
        } = this.state;

        if (isLoading) return null;

        let validEntry = true;
        // Validate first name
        if (!firstName || !firstName.match(wordsOnly)) {
            this.setState({ firstNameError: 'Invalid first name' });
            validEntry = false;
        }

        // Validate last name
        if (!lastName || !lastName.match(wordsOnly)) {
            this.setState({ lastNameError: 'Invalid first name' });
            validEntry = false;
        }

        // Validate email
        if (!String(nusEmail).includes(NUSEmailSignature)) {
            // Potential update: check with tembu email database here?
            this.setState({ emailError: 'Please use your NUS email' });
            validEntry = false;
        }

        // Validate password
        if (!password.match(passwordFormat)) {
            this.setState({
                password: '',
                confirmPassword: '',
                passwordError:
                    'Password must be at least eight characters long with one letter and one number',
            });
            validEntry = false;
        }

        // Validate confirm password
        if (!passwordError && password !== confirmPassword) {
            this.setState({
                password: '',
                confirmPassword: '',
                passwordError: 'Passwords do not match',
            });
            validEntry = false;
        }

        if (!validEntry) {
            return null;
        }

        console.log('VALID');
        return this.signUp.bind(this)();
    }

    emailSentPopup = () => {
        Popup.show({
            type: 'Success',
            title: 'Email link sent',
            body:
                'We sent an email to\n' +
                this.state.nusEmail +
                '\nwith a verification link to activate your account.',
            showButton: true,
            buttonText: 'OK',
            autoClose: false,
            verticalOffset: 50,
            callback: () => {
                Popup.hide();
                this.props.navigation.navigate('SignIn');
            },
        });
    };

    render() {
        const {
            firstName,
            lastName,
            nusEmail,
            password,
            confirmPassword,
            firstNameError,
            lastNameError,
            emailError,
            passwordError,
            generalError,
            passwordHidden,
            passwordIcon,
            confirmPasswordHidden,
            confirmPasswordIcon,
            isLoading,
            keyboardShown,
        } = this.state;

        return (
            <Root
                style={[
                    styles.container,
                    {
                        paddingBottom:
                            Platform.OS === 'ios' && keyboardShown
                                ? this.state.keyboardHeight
                                : null,
                    },
                ]}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {keyboardShown ? null : <View style={styles.header} />}
                        <View style={styles.titleContainer}>
                            <MainText style={styles.title}> Sign Up</MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={[styles.box, { flexDirection: 'row' }]}>
                                <View style={{ flex: 1, flexDirection: 'column', marginRight: 5 }}>
                                    <FormInput
                                        style={
                                            firstNameError ? styles.errorInput : styles.validInput
                                        }
                                        placeholder="First Name"
                                        returnKeyType="next"
                                        textContentType="name"
                                        autoCapitalize="words"
                                        value={firstName}
                                        onChangeText={this.handleFirstName.bind(this)}
                                        onFocus={this.clearFirstNameError.bind(this)}
                                    />
                                    <ErrorMessage error={firstNameError ? firstNameError : ' '} />
                                </View>

                                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                                    <FormInput
                                        style={
                                            lastNameError ? styles.errorInput : styles.validInput
                                        }
                                        placeholder="Last Name"
                                        returnKeyType="next"
                                        textContentType="name"
                                        autoCapitalize="words"
                                        value={lastName}
                                        onChangeText={this.handleLastName.bind(this)}
                                        onFocus={this.clearLastNameError.bind(this)}
                                    />
                                    <ErrorMessage error={lastNameError ? lastNameError : ' '} />
                                </View>
                            </View>

                            <View style={styles.box}>
                                <FormInput
                                    style={emailError ? styles.errorInput : styles.validInput}
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                    onFocus={this.clearEmailError.bind(this)}
                                />
                                <ErrorMessage error={emailError ? emailError : ' '} />
                            </View>

                            <View style={styles.box}>
                                <FormInput
                                    style={passwordError ? styles.errorInput : styles.validInput}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    textContentType="none"
                                    onChangeText={this.handlePassword.bind(this)}
                                    onFocus={this.clearPasswordError.bind(this)}
                                    secureTextEntry={passwordHidden}
                                    value={password}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={this.handlePasswordVisibility.bind(this)}
                                        >
                                            <Ionicons
                                                name={passwordIcon}
                                                size={28}
                                                color={Colors.appGray}
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <MainText />
                            </View>
                            <View style={styles.box}>
                                <FormInput
                                    style={passwordError ? styles.errorInput : styles.validInput}
                                    placeholder="Confirm password"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="none"
                                    onChangeText={this.handleConfirmPassword.bind(this)}
                                    onFocus={this.clearPasswordError.bind(this)}
                                    secureTextEntry={confirmPasswordHidden}
                                    value={confirmPassword}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={this.handleConfirmPasswordVisibility.bind(
                                                this
                                            )}
                                        >
                                            <Ionicons
                                                name={confirmPasswordIcon}
                                                size={28}
                                                color={Colors.appGray}
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage error={passwordError ? passwordError : ' '} />
                            </View>
                            <View style={styles.box}>
                                <AuthButton
                                    onPress={this.validateInputAndSignUp.bind(this)}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Sign Up
                                </AuthButton>
                                <ErrorMessage
                                    error={generalError ? generalError : ' '}
                                    style={{ textAlign: 'center' }}
                                />
                            </View>
                        </View>
                        {!keyboardShown && (
                            <View style={styles.bottom}>
                                <MainText style={styles.haveAccountText}>
                                    Already have an account?{' '}
                                    <Text
                                        style={styles.hyperlink}
                                        onPress={this.goToSignIn.bind(this)}
                                    >
                                        Login here
                                    </Text>
                                </MainText>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 40,
        color: Colors.appGreen,
        textAlign: 'left',
        width: Layout.window.width,
        left: 35,
    },
    header: {
        flex: 1,
    },
    titleContainer: {
        flex: 1.5,
        justifyContent: 'flex-end',
        paddingBottom: 8,
    },
    form: {
        flex: 3.5,
        justifyContent: 'center',
        marginHorizontal: 40,
    },
    bottom: {
        flex: 1.5,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    validInput: {
        borderColor: Colors.appGray,
    },
    errorInput: {
        borderColor: Colors.appRed,
    },
    box: {
        marginBottom: 5,
    },
    button: {
        marginTop: 10,
    },
    haveAccountText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.appBlack,
        marginBottom: 20,
    },
    hyperlink: {
        color: Colors.appGreen,
    },
});

export default withFirebase(SignUpScreen);
