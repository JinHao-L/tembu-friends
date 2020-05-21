import React from 'react';
import { View, Button, Text, Card, StyleSheet } from 'react-native';
import { onSignOut } from './auth';
import { Colors } from '../constants';

const ProfilePage = () => {
    // constructor(props) {
    //     super(props);
    //
    //     // this.toggleTheme = () => {
    //     //     this.setState(state => ({
    //     //         theme: state.theme === themes.dark
    //     //             ? themes.light
    //     //             : themes.dark,
    //     //     }))
    //     // };
    //
    //     // this.state = {
    //     //     theme: themes.light,
    //     //     toggleTheme: this.toggleTheme,
    //     // };
    // }

    return (
        <View style={styles.container}>
            <Card title="John">
                <View
                    style={[
                        styles.box,
                        {
                            width: 80,
                            height: 80,
                            alignSelf: 'center',
                            backgroundColor: Colors.box,
                        },
                    ]}
                >
                    <Text> Ipsum Lorem </Text>
                </View>
                <Button
                    style={[
                        styles.button,
                        // {backgroundColor: currTheme.background}
                    ]}
                    title="Sign Out"
                    onPress={() => onSignOut()}
                />
            </Card>
            {/* <ThemeContext.Provider value = {this.state}> */}
            {/*    <ThemeTogglerButton/> */}
            {/* </ThemeContext.Provider> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    box: {
        flex: 0.3,
        justifyContent: 'center',
        borderWidth: 5,
        borderRadius: 20,
        backgroundColor: Colors.box,
    },
    button: {
        padding: 10,
        margin: 15,
        height: 40,
        backgroundColor: Colors.button,
    },
});

export default ProfilePage;
