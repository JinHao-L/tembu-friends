import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    ScrollView,
    Platform,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';

import { withFirebase } from '../../helper/Firebase';
import { Colors, NUSEmailSignature, Layout } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText, Popup, LogoText } from '../../components';

class ForgetPassword extends Component {
    state = {
        // Details
        nusEmail: '',

        // Control - errors
        emailError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        keyboardShown: false,
        keyboardHeight: 0,
        resetSuccessPopup: false,
    };

    clearInputs = () => {
        this.setState({
            nusEmail: '',
            emailError: '',
            generalError: '',
        });
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide
        );
    }

    _keyboardDidShow = (event) => {
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            keyboardShown: false,
            keyboardHeight: 0,
        });
    };

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onResetSuccess = () => {
        this.toggleResetSuccessPopup();
    };

    onResetFailure = (error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
            // Indicates the user account was not found.
            this.setState({
                emailError: 'Unregistered email address',
            });
        } else if (errorCode === 'auth/invalid-email') {
            // 17008: Indicates the email is invalid.
            this.setState({
                emailError: 'Invalid email address',
            });
        } else if (errorCode === 'auth/network-request-failed') {
            // Indicates network error
            this.setState({ generalError: 'Network error' });
        } else {
            // Others
            this.setState({ generalError: 'Unknown error' });
            console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
        }
    };

    goToSignIn = () => {
        this.clearInputs();
        this.props.navigation.navigate('SignIn');
    };

    handleEmail = (text) => {
        this.setState({ nusEmail: text });
    };

    clearError = () => {
        this.setState({
            emailError: '',
        });
    };

    resetPassword = async () => {
        const { nusEmail } = this.state;
        this.setState({ isLoading: true });
        try {
            await this.props.firebase.sendPasswordReset(nusEmail);
            console.log('Password reset email sent successfully');
            this.onResetSuccess();
        } catch (error) {
            this.onResetFailure(error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    validateInput = () => {
        Keyboard.dismiss();
        if (!String(this.state.nusEmail).includes(NUSEmailSignature)) {
            this.setState({ emailError: 'Invalid email domain' });
            return null;
        }
        return this.resetPassword();
    };

    renderResetSuccessPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.resetSuccessPopup}
                title={'Email link sent'}
                body={
                    'We sent an email to\n' +
                    this.state.nusEmail +
                    '\nwith a link to get back into your account.'
                }
                buttonText={'OK'}
                callback={() => {
                    this.toggleResetSuccessPopup();
                    this.setState({
                        nusEmail: '',
                    });
                }}
            />
        );
    };

    toggleResetSuccessPopup = () => {
        this.setState({
            resetSuccessPopup: !this.state.resetSuccessPopup,
        });
    };

    render() {
        const { nusEmail, emailError, generalError, isLoading, keyboardShown } = this.state;

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
                        {this.renderResetSuccessPopup()}
                        {!keyboardShown && (
                            <View style={styles.bottom}>
                                <MainText style={styles.backLoginText} onPress={this.goToSignIn}>
                                    Back to Login
                                </MainText>
                            </View>
                        )}
                        <View style={{ marginBottom: 5 }}>
                            <View style={styles.textContainer}>
                                <MainText
                                    style={styles.title}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    Trouble with logging in?
                                </MainText>
                                <MainText style={styles.intro} adjustsFontSizeToFit={true}>
                                    Enter your email address and we'll send you a link to reset your
                                    password
                                </MainText>
                            </View>

                            <View style={styles.form}>
                                <FormInput
                                    containerStyle={styles.box}
                                    isError={emailError}
                                    errorMessage={emailError}
                                    leftIconName="ios-mail"
                                    placeholder="NUS email address"
                                    returnKeyType="done"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail}
                                    onFocus={this.clearError}
                                    onSubmitEditing={this.validateInput}
                                />
                                <AuthButton
                                    onPress={this.validateInput}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Next
                                </AuthButton>
                                <ErrorMessage
                                    error={generalError}
                                    style={{ textAlign: 'center' }}
                                />
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
        backgroundColor: Colors.appWhite,
        alignItems: 'center',
    },
    title: {
        fontSize: 100,
        color: Colors.appGreen,
        textAlign: 'center',
        marginBottom: 10,
        marginHorizontal: 15,
    },
    textContainer: {
        width: Layout.window.width,
    },
    intro: {
        fontSize: undefined,
        flexWrap: 'wrap',
        textAlign: 'center',
        marginHorizontal: 40,
    },
    form: {
        marginTop: 10,
        marginHorizontal: 40,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 56,
        alignItems: 'center',
    },
    box: {
        marginTop: 10,
    },
    button: {
        marginTop: 10,
    },
    backLoginText: {
        fontWeight: '600',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.appGreen,
    },
});

export default withFirebase(ForgetPassword);
