import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText } from '../../components';

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
        passwordVisibility: true,
    };

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
            this.setState({ generalError: errorMessage });
            console.warn('Unknown error: ' + errorCode);
        }
    }

    goToRegister() {
        console.log('Go to sign up');
        this.props.navigation.navigate('SignUp');
    }

    goToForgetPassword() {
        console.log('Go to forget password');
        this.props.navigation.navigate('ForgetPassword');
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordVisibility: !prevState.passwordVisibility,
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
        await this.props.firebase
            .signInWithEmail(nusEmail, password)
            .then(this.onSignInSuccess.bind(this))
            .catch((error) => {
                this.onSignInFailure.bind(this)(error);
            })
            .finally(this.setState({ isLoading: false }));
    }

    validateInputAndSignIn() {
        if (!String(this.state.nusEmail).includes(NUSEmailSignature)) {
            this.setState({ emailError: 'Invalid email domain' });
            return null;
        }
        return this.signIn.bind(this)();
    }

    render() {
        const {
            passwordVisibility,
            passwordIcon,
            password,
            nusEmail,
            generalError,
            emailError,
            errorHighlight,
            isLoading,
        } = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -150}
                contentContainerStyle={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <View style={styles.titleContainer}>
                            <MainText style={styles.title}>Tembu Friends</MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.box}>
                                <FormInput
                                    style={
                                        errorHighlight || emailError
                                            ? styles.errorInput
                                            : styles.validInput
                                    }
                                    leftIconName="ios-mail"
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
                                    style={errorHighlight ? styles.errorInput : styles.validInput}
                                    leftIconName="ios-lock"
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="newPassword"
                                    onChangeText={this.handlePassword.bind(this)}
                                    secureTextEntry={passwordVisibility}
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
                            </View>
                            <View style={styles.box}>
                                <MainText
                                    style={[styles.hyperlink, styles.forgetPasswordText]}
                                    onPress={this.goToForgetPassword.bind(this)}
                                >
                                    Forgotten password?
                                </MainText>
                            </View>
                            <View style={styles.box}>
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

                        <View style={styles.bottom}>
                            <MainText style={styles.registerText}>
                                Don't have an Account?{' '}
                                <MainText
                                    style={styles.hyperlink}
                                    onPress={this.goToRegister.bind(this)}
                                >
                                    Sign Up
                                </MainText>
                            </MainText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: 'green',
        marginBottom: 10,
        textAlign: 'left',
    },
    titleContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        // alignItems: 'flex-start',
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10,
        // marginHorizontal: 30,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    validInput: {
        borderColor: 'gray',
    },
    errorInput: {
        borderColor: 'red',
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
        color: 'black',
        marginBottom: 20,
    },
    hyperlink: {
        color: 'green',
    },
});

export default withFirebase(SignInScreen);
