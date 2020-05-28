import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature, Layout } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText } from '../../components';
import { Popup, Root } from '../../components/Popup';

class SignInScreen extends Component {
    state = {
        // Details
        email: '',
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
    };

    clearInputs() {
        this.setState({
            email: '',
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

    _keyboardDidShow() {
        console.log('Keyboard Shown');
        if (!this.state.keyboardShown) {
            this.setState(
                {
                    keyboardShown: true,
                }
                // () => console.log(this.state.keyboardShown)
            );
        }
    }

    _keyboardDidHide() {
        console.log('Keyboard Hidden');
        if (this.state.keyboardShown) {
            this.setState(
                {
                    keyboardShown: false,
                }
                // () => console.log(this.state.keyboardShown)
            );
        }
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
                    this.notVerifiedPopup(() => this.user.sendEmailVerification());
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
            body:
                'Click the link in the email we sent to verify your email address. ' +
                'Click here' +
                ' to resend it.',
            showButton: true,
            buttonText: 'OK',
            autoClose: false,
            verticalOffset: 40,
            callback: () => {
                this.props.firebase.signOut();
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                contentContainerStyle={{ flex: 1 }}
            >
                <Root>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            {keyboardShown ? null : <View style={styles.header} />}
                            <View style={styles.titleContainer}>
                                <MainText style={styles.title}>
                                    Tembu<Text style={styles.title2}>Friends</Text>
                                </MainText>
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
                                    />
                                    <ErrorMessage error={emailError ? emailError : ' '} />
                                </View>
                                <View style={styles.box}>
                                    <FormInput
                                        style={
                                            errorHighlight ? styles.errorInput : styles.validInput
                                        }
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
                                                    color="grey"
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
                                        <MainText
                                            style={styles.hyperlink}
                                            onPress={this.goToRegister.bind(this)}
                                        >
                                            Sign Up
                                        </MainText>
                                    </MainText>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </Root>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.authBackground,
    },
    title: {
        fontSize: 40,
        // Tembu color
        color: Colors.greenText,
        marginBottom: 10,
        textAlign: 'center',
        width: Layout.window.width,
    },
    title2: {
        // Friends color
        color: 'green',
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
        borderColor: Colors.defaultBorder,
    },
    errorInput: {
        borderColor: Colors.errorBorder,
    },
    box: {
        flex: 1,
        marginTop: 10,
    },
    button: {
        marginTop: 10,
    },
    forgetPasswordText: {
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'right',
    },
    registerText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.defaultText,
        marginBottom: 20,
    },
    hyperlink: {
        color: Colors.greenText,
    },
});

export default withFirebase(SignInScreen);
