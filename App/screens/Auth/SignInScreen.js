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
import Icon from 'react-native-vector-icons/Ionicons';

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
    };
    navigating = false;

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
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('SignUp');
    }

    goToForgetPassword() {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
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
                buttonText={'OK'}
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
                                    this.props.firebase.signOut().then((r) => {
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
                buttonText={'OK'}
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
                {this.renderNotVerifiedPopup()}
                {this.renderEmailSentPopup()}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {keyboardShown ? null : <View style={styles.header} />}
                        <View style={styles.titleContainer}>
                            <LogoText style={styles.title} adjustsFontSizeToFit={true}>
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
                                blurOnSubmit={false}
                            />
                            <FormInput
                                containerStyle={styles.box}
                                isError={errorHighlight}
                                errorMessage={generalError}
                                errorStyle={{ textAlign: 'center' }}
                                placeholder="Password"
                                autoCapitalize="none"
                                returnKeyType="done"
                                textContentType="newPassword"
                                onChangeText={this.handlePassword.bind(this)}
                                onFocus={this.clearError.bind(this)}
                                secureTextEntry={passwordHidden}
                                value={password}
                                rightIcon={
                                    <TouchableOpacity
                                        onPress={this.handlePasswordVisibility.bind(this)}
                                    >
                                        <Icon
                                            name={passwordIcon}
                                            size={28}
                                            color="lightgray"
                                            style={{ marginRight: 5 }}
                                        />
                                    </TouchableOpacity>
                                }
                            />

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
            </View>
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
        color: Colors.appGreen,
        marginBottom: 10,
        textAlign: 'center',
        width: Layout.window.width,
    },
    title2: {
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
