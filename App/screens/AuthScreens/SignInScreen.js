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
import { AuthButton, FormInput, ErrorMessage, LogoText, MainText } from '../../components';
import { Popup, Root } from '../../components/Popup';

class SignInScreen extends Component {
    state = {
        // Details
        nusEmail: '',
        password: '',

        // Control - errors
        emailError: '',
        errorHighlight: false,
        generalError: '',

        // Control - others
        isLoading: false,
        passwordIcon: 'ios-eye',
        passwordHidden: true,
        keyboardShown: false,
        disabled: false,
        keyboardHeight: 0,
    };

    clearInputs() {
        this.setState({
            nusEmail: '',
            password: '',
            emailError: '',
            errorHighlight: false,
            generalError: '',
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
        if (!this.state.keyboardShown) {
            this.setState({
                keyboardShown: true,
                keyboardHeight: event.endCoordinates.height,
            });
        }
    }

    _keyboardDidHide() {
        if (this.state.keyboardShown) {
            this.setState({
                keyboardShown: false,
            });
        }
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onSignInSuccess() {
        this.setState({
            nusEmail: '',
            password: '',
        });
    }

    onSignInFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/user-disabled') {
            this.setState({ generalError: 'Account disabled. Please contact administration' });
        } else if (
            errorCode === 'auth/invalid-email' ||
            errorCode === 'auth/wrong-password' ||
            errorCode === 'auth/user-not-found'
        ) {
            this.setState({
                generalError: 'Invalid email address or password',
                errorHighlight: true,
            });
        } else if (errorCode === 'auth/too-many-requests') {
            // Indicates that too many requests were made to a server method.
            this.setState({ generalError: 'Too many login attempts. Please try again later' });
        } else if (errorCode === 'auth/network-request-failed') {
            // Indicates network error
            this.setState({ generalError: 'Network error' });
        } else {
            // Others
            this.setState({ generalError: 'Unknown error' });
            console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
        }
    }

    goToRegister() {
        console.log('Go to sign up');
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('SignUp');
    }

    goToForgetPassword() {
        console.log('Go to forget password');
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('ForgetPassword');
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordHidden: !prevState.passwordHidden,
        }));
    }

    handleEmail(text) {
        this.setState({ nusEmail: text, errorHighlight: false, emailError: '' });
    }

    handlePassword(text) {
        this.setState({ password: text, errorHighlight: false });
    }

    async signIn() {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });

        try {
            const response = await this.props.firebase.signInWithEmail(nusEmail, password);

            if (response && response.user) {
                if (response.user.userVerified) {
                    console.log('verified');
                    this.onSignInSuccess.bind(this)();
                } else {
                    console.log('not verified');
                    this.notVerifiedPopup(async () => {
                        await response.user.sendEmailVerification();
                    });
                }
            }
        } catch (error) {
            this.onSignInFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateInputAndSignIn() {
        Keyboard.dismiss();
        if (!String(this.state.nusEmail).includes(NUSEmailSignature)) {
            this.setState({ emailError: 'Invalid email domain' });
            return null;
        }
        return this.signIn.bind(this)();
    }

    notVerifiedPopup = (sendLink) => {
        Popup.show({
            type: 'Failure',
            title: 'Email Address Not Verified',
            specialBodyCall: () => {
                return (
                    <Text>
                        Click the link in the email we sent to verify your email address.{' '}
                        <Text
                            onPress={() => {
                                console.log('Init');
                                sendLink().then(() => {
                                    this.props.firebase.signOut().then((r) => {
                                        console.log('Closed and opening next');
                                        this.emailSentPopup();
                                        console.log('Done');
                                    });
                                });
                            }}
                            style={styles.hyperlink}
                        >
                            Click here
                        </Text>{' '}
                        to resend it.
                    </Text>
                );
            },
            showButton: true,
            buttonText: 'OK',
            autoClose: false,
            verticalOffset: 30,
            callback: () => {
                this.props.firebase.signOut();
                Popup.hide();
            },
        });
    };

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
            verticalOffset: 30,
            callback: () => {
                Popup.hide();
            },
        });
    };

    render() {
        const {
            passwordHidden,
            passwordIcon,
            password,
            nusEmail,
            generalError,
            emailError,
            errorHighlight,
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
                            <LogoText style={styles.title}>
                                TEMBU<Text style={styles.title2}>FRIENDS</Text>
                            </LogoText>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.box}>
                                <FormInput
                                    style={
                                        errorHighlight || emailError
                                            ? styles.errorInput
                                            : styles.validInput
                                    }
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                    blurOnSubmit={false}
                                />
                                <ErrorMessage error={emailError ? emailError : ' '} />
                            </View>
                            <View>
                                <FormInput
                                    style={errorHighlight ? styles.errorInput : styles.validInput}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="newPassword"
                                    onChangeText={this.handlePassword.bind(this)}
                                    secureTextEntry={passwordHidden}
                                    value={password}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={this.handlePasswordVisibility.bind(this)}
                                        >
                                            <Ionicons
                                                name={passwordIcon}
                                                size={28}
                                                color="lightgray"
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <MainText />
                            </View>

                            <View style={styles.box}>
                                <MainText
                                    style={[styles.hyperlink, styles.forgetPasswordText]}
                                    onPress={this.goToForgetPassword.bind(this)}
                                >
                                    Forgotten password?
                                </MainText>
                                <AuthButton
                                    onPress={this.validateInputAndSignIn.bind(this)}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Log In
                                </AuthButton>
                                <ErrorMessage error={generalError ? generalError : ' '} />
                            </View>
                        </View>

                        {keyboardShown ? (
                            <View style={{ flex: 0.5 }} />
                        ) : (
                            <View style={styles.bottom}>
                                <MainText style={styles.registerText}>
                                    Don't have an account?{' '}
                                    <Text
                                        style={styles.hyperlink}
                                        onPress={this.goToRegister.bind(this)}
                                    >
                                        Sign Up
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 40,
        // Color of 'Tembu' in 'TembuFriends'
        color: Colors.appGreen,
        marginBottom: 10,
        textAlign: 'center',
        width: Layout.window.width,
    },
    title2: {
        // Color of 'Friends' in 'TembuFriends'
        color: Colors.appBlack,
    },
    header: {
        flex: 0.5,
    },
    titleContainer: {
        flex: 1.5,
        justifyContent: 'flex-end',
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10,
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
        marginBottom: 3,
    },
    button: {
        marginTop: 10,
    },
    forgetPasswordText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'right',
    },
    registerText: {
        position: 'absolute',
        bottom: 0,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.appBlack,
        marginBottom: 20,
    },
    hyperlink: {
        color: Colors.appGreen,
    },
});

export default withFirebase(SignInScreen);
