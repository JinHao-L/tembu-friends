import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { withFirebase } from '../../helper/Firebase';
import { Colors, NUSEmailSignature, Layout } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText, Popup } from '../../components';
import * as firebase from 'firebase';

const wordsOnly = /^[A-Za-z ]+$/;
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
        emailSentPopup: false,
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
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    }

    _keyboardDidHide() {
        this.setState({
            keyboardShown: false,
        });
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onSignUpSuccess() {
        this.toggleEmailSentPopup();
        this.setState({
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
            this.setState({ generalError: 'Unknown error' + errorCode });
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

        this.props.firebase
            .signUpWithEmail(nusEmail, password)
            .then((response) => {
                const userData = {
                    uid: response.user.uid,
                    email: nusEmail,
                    firstName: firstName,
                    lastName: lastName,
                };
                console.log('User created. Creating profile');
                return this.props.firebase
                    .createProfile(userData)
                    .then(response.user.sendEmailVerification);
            })
            .then(() => {
                this.props.firebase.signOut();
                console.log('Auto sign out');
            })
            .then(() => {
                this.onSignUpSuccess.bind(this)();
            })
            .catch((error) => {
                this.onSignUpFailure.bind(this)(error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
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

        console.log('Inputs valid');
        return this.signUp.bind(this)();
    }

    toggleEmailSentPopup = () => {
        this.setState({
            emailSentPopup: !this.state.emailSentPopup,
        });
    };

    renderEmailSentPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.emailSentPopup}
                title={'Sign Up Success'}
                body={
                    'We sent an email to\n' +
                    this.state.nusEmail +
                    '\nwith a verification link to activate your account.'
                }
                buttonText={'OK'}
                callback={() => {
                    this.toggleEmailSentPopup();
                    this.setState({
                        firstName: '',
                        lastName: '',
                        nusEmail: '',
                    });
                    this.goToSignIn();
                }}
            />
        );
    };
    renderLoading = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.isLoading}
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
            <View
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
                {this.renderLoading()}
                {this.renderEmailSentPopup()}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {keyboardShown ? null : <View style={styles.header} />}
                        <View style={styles.titleContainer}>
                            <MainText style={styles.title}> Sign Up</MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={[styles.box, { flexDirection: 'row' }]}>
                                <FormInput
                                    containerStyle={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        marginRight: 5,
                                    }}
                                    isError={firstNameError}
                                    errorMessage={firstNameError}
                                    placeholder="First Name"
                                    returnKeyType="next"
                                    textContentType="name"
                                    autoCapitalize="words"
                                    value={firstName}
                                    onChangeText={this.handleFirstName.bind(this)}
                                    onFocus={this.clearFirstNameError.bind(this)}
                                />

                                <FormInput
                                    containerStyle={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        marginLeft: 5,
                                    }}
                                    isError={lastNameError}
                                    errorMessage={lastNameError}
                                    placeholder="Last Name"
                                    returnKeyType="next"
                                    textContentType="name"
                                    autoCapitalize="words"
                                    value={lastName}
                                    onChangeText={this.handleLastName.bind(this)}
                                    onFocus={this.clearLastNameError.bind(this)}
                                />
                            </View>

                            <FormInput
                                containerStyle={styles.box}
                                isError={emailError}
                                errorMessage={emailError}
                                placeholder="NUS email address"
                                keyboardType="email-address"
                                returnKeyType="next"
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                value={nusEmail}
                                onChangeText={this.handleEmail.bind(this)}
                                onFocus={this.clearEmailError.bind(this)}
                            />

                            <FormInput
                                containerStyle={styles.box}
                                isError={passwordError}
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
                                        <Icon
                                            name={passwordIcon}
                                            size={28}
                                            color={Colors.appGray}
                                            style={{ marginRight: 5 }}
                                        />
                                    </TouchableOpacity>
                                }
                            />
                            <FormInput
                                containerStyle={styles.box}
                                isError={passwordError}
                                errorMessage={passwordError}
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
                                        onPress={this.handleConfirmPasswordVisibility.bind(this)}
                                    >
                                        <Icon
                                            name={confirmPasswordIcon}
                                            size={28}
                                            color={Colors.appGray}
                                            style={{ marginRight: 5 }}
                                        />
                                    </TouchableOpacity>
                                }
                            />
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
            </View>
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
