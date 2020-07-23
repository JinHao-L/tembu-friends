import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    Text,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from 'react-native-elements';

import { withFirebase } from '../../helper/Firebase';
import { Colors, NUSEmailSignature, Layout } from '../../constants';
import { AuthButton, FormInput, LogoText, MainText, Popup } from '../../components';

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
        user: null,

        emailSentPopup: false,
        notVerifiedPopup: false,
        userDisabledPopup: false,
    };
    passwordRef = React.createRef();

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
                keyboardHeight: 0,
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
            this.toggleUserDisabledPopup();
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
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('SignUp');
    }

    goToForgetPassword() {
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
        this.setState({ nusEmail: text });
    }
    handlePassword(text) {
        this.setState({ password: text });
    }

    clearError() {
        this.setState({
            errorHighlight: false,
            emailError: '',
        });
    }

    async signIn() {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });

        try {
            const response = await this.props.firebase.signInWithEmail(nusEmail, password);

            if (response && response.user) {
                if (response.user.emailVerified) {
                    this.onSignInSuccess.bind(this)();
                } else {
                    this.setState(
                        {
                            user: response.user,
                        },
                        this.toggleNotVerifiedPopup
                    );
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

    toggleNotVerifiedPopup = () => {
        this.setState({
            notVerifiedPopup: !this.state.notVerifiedPopup,
        });
    };

    toggleEmailSentPopup = () => {
        this.setState({
            emailSentPopup: !this.state.emailSentPopup,
        });
    };

    toggleUserDisabledPopup = () => {
        this.setState({
            userDisabledPopup: !this.state.userDisabledPopup,
        });
    };

    renderUserDisabledPopup = () => {
        return (
            <Popup
                imageType={'Failure'}
                isVisible={this.state.userDisabledPopup}
                title={'Account Banned'}
                body={
                    'Your account has been banned for violating our terms. ' +
                    'Approach your RA to appeal the ban.'
                }
                buttonText={'Close'}
                callback={this.toggleUserDisabledPopup}
            />
        );
    };

    renderEmailSentPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.emailSentPopup}
                title={'Email link sent'}
                body={
                    'We sent an email to\n' +
                    this.state.nusEmail +
                    '\nwith a verification link to activate your account.'
                }
                buttonText={'Close'}
                callback={this.toggleEmailSentPopup}
            />
        );
    };

    renderNotVerifiedPopup = () => {
        return (
            <Popup
                imageType={'Failure'}
                isVisible={this.state.notVerifiedPopup}
                title={'Email Address Not Verified'}
                body={
                    <Text>
                        Click the link in the email we sent to verify your email address.{' '}
                        <Text
                            onPress={() => {
                                this.state.user.sendEmailVerification().then(() => {
                                    this.props.firebase.signOut().then(() => {
                                        this.toggleNotVerifiedPopup();
                                        this.toggleEmailSentPopup();
                                    });
                                });
                            }}
                            style={styles.hyperlink}
                        >
                            Click here
                        </Text>{' '}
                        to resend it.
                    </Text>
                }
                buttonText={'Close'}
                callback={() => {
                    this.toggleNotVerifiedPopup();
                    this.props.firebase.signOut();
                }}
            />
        );
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
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={[
                            styles.container,
                            {
                                paddingBottom:
                                    Platform.OS === 'ios' ? this.state.keyboardHeight : undefined,
                                justifyContent: keyboardShown ? 'flex-end' : 'center',
                            },
                        ]}
                    >
                        {this.renderNotVerifiedPopup()}
                        {this.renderEmailSentPopup()}
                        {this.renderUserDisabledPopup()}
                        {!keyboardShown && (
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
                        <View style={{ marginBottom: 20 }}>
                            <View style={styles.titleContainer}>
                                <LogoText
                                    style={styles.title}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    TEMBU<Text style={styles.title2}>FRIENDS</Text>
                                </LogoText>
                            </View>

                            <View style={styles.form}>
                                <FormInput
                                    containerStyle={styles.box}
                                    isError={errorHighlight || emailError}
                                    errorMessage={emailError}
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                    onFocus={this.clearError.bind(this)}
                                    onSubmitEditing={() => this.passwordRef.focus()}
                                />
                                <FormInput
                                    inputRef={(input) => (this.passwordRef = input)}
                                    containerStyle={styles.box}
                                    isError={errorHighlight}
                                    errorMessage={generalError}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="newPassword"
                                    onChangeText={this.handlePassword.bind(this)}
                                    onFocus={this.clearError.bind(this)}
                                    secureTextEntry={passwordHidden}
                                    value={password}
                                    rightIcon={
                                        <Icon
                                            type={'ionicon'}
                                            name={passwordIcon}
                                            size={28}
                                            color={Colors.appGray2}
                                            containerStyle={{ marginRight: 5 }}
                                            onPress={this.handlePasswordVisibility.bind(this)}
                                        />
                                    }
                                    onSubmitEditing={this.validateInputAndSignIn.bind(this)}
                                />

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
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 100,
        color: Colors.appGreen,
        textAlign: 'center',
        marginHorizontal: 40,
    },
    title2: {
        color: Colors.appBlack,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 56,
        alignItems: 'center',
    },
    titleContainer: {
        marginBottom: 20,
        width: Layout.window.width,
    },
    form: {
        justifyContent: 'flex-start',
        marginHorizontal: 40,
    },
    box: {
        marginBottom: 3,
    },
    button: {
        marginTop: 10,
    },
    forgetPasswordText: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'right',
    },
    registerText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.appBlack,
    },
    hyperlink: {
        color: Colors.appGreen,
    },
});

export default withFirebase(SignInScreen);
