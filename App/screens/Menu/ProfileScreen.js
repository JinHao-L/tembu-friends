import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList, Text, YellowBox } from 'react-native';

import { MainText } from '../../components';
import { Colors } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { Popup, Root } from '../../components/Popup';

YellowBox.ignoreWarnings(['Setting a timer']);
class ProfileScreen extends Component {
    state = {
        intro: 'Love to share and learn! Hope to meet like-minded people here as well!',
        groups: [
            { id: '1', grp: 'Dodgeball (Captain)' },
            { id: '2', grp: 'Urban Farmers' },
            { id: '3', grp: 'Techne' },
            { id: '4', grp: 'House Committee' },
        ],
        modules: [
            { id: '1', code: 'UTW1001Z', name: 'Colour: Theory, Meaning and Practice' },
            { id: '2', code: 'UTW1002C', name: 'Junior Seminar: Fakes' },
            { id: '3', code: 'UTW2001Q', name: '‘What’s in a Word?’ Meaning Across Cultures' },
            { id: '4', code: 'OTH157', name: 'The Heart of Negotiation' },
        ],
        wall: [
            {
                id: '1',
                picture: '../../images/profile1.png',
                name: 'Felicia Low',
                message:
                    'It was a pleasure working with you in House Comm! Stay positive and hope you had a great sem ^^',
            },
            {
                id: '2',
                picture: 'images/profile2.png',
                name: 'David Lee',
                message:
                    'Hey bro, thanks for the constant guidance in Com Science! Couldn’t have made it this far without you! Do stay in touch and I hope to see you in the next... ',
            },
        ],
        // isLoading: true,
        isLoadingTemp: true,
    };

    getDisplayName() {
        return this.props.firebase.getCurrentUser().displayName;
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerStyle: {
                backgroundColor: Colors.headerBackground,
            },
            headerTintColor: Colors.headerText,
            headerTitleAlign: 'center',
        });
        // this.retrieveData();
        // this.updateUserList();
    }

    // retrieveData() {
    //     const uid = this.props.firebase.getCurrentUser().uid;
    //     this.props.firebase.getUserData(uid).then((results) => {
    //         if (results) {
    //             this.setState({ results, isLoading: false });
    //         } else this.props.navigation.back();
    //     });
    // }

    // async updateUserList() {
    //     try {
    //         const results = await this.props.firebase.getTempData();
    //         if (results) {
    //             const { groups, modules, intro } = results;
    //             this.setState({
    //                 isLoadingTemp: false,
    //                 groups: groups.val(),
    //                 modules: modules,
    //                 intro: intro,
    //             });
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    testingPopup = () => {
        Popup.show({
            type: 'Testing',
            title: 'Not available',
            body: 'Under Maintenance... \nClosing in 5 seconds',
            showButton: true,
            buttonText: 'Close',
            autoClose: true,
            // because of bottom tab bar
            verticalOffset: 50,
        });
    };

    render() {
        const { groups, modules, intro, wall } = this.state;
        return (
            <Root style={styles.container}>
                <View style={styles.info}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={require('../../assets/images/Profile.png')}
                        />
                    </View>
                    <View style={styles.infoText}>
                        <MainText style={styles.infoText}>{this.getDisplayName()}</MainText>
                        <MainText style={styles.infoText}>
                            <Text style={{ color: 'red' }}>Tancho</Text> #15-151
                        </MainText>
                        <MainText style={styles.infoText}>Computer Science, Y1</MainText>
                        <MainText style={styles.infoText}>English, Mandarin</MainText>
                    </View>
                </View>
                <View style={[styles.box, styles.intro]}>
                    <MainText style={styles.title}>Why am I in Tembusu?</MainText>
                    <MainText>{intro}</MainText>
                </View>
                <View style={[styles.box, styles.groups]}>
                    <MainText style={styles.title}>
                        Interest Groups & Committees that I'm in!
                    </MainText>
                    <FlatList
                        data={groups}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row' }}>
                                <MainText> - </MainText>
                                <MainText>{item.grp}</MainText>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={[styles.box, styles.modules]}>
                    <MainText style={styles.title}>Modules that I have taken in Tembusu!</MainText>
                    <FlatList
                        data={modules}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row' }}>
                                <MainText> - </MainText>
                                <MainText>
                                    {item.code} {item.name}
                                </MainText>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={[styles.box, styles.wall]}>
                    <View style={styles.wallHeader}>
                        <MainText style={[styles.title]}>My Wall (8)</MainText>
                        <MainText style={[styles.title]} onPress={this.testingPopup}>
                            See All >
                        </MainText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={wall}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <View style={styles.miniImageContainer}>
                                        <Image
                                            style={styles.miniImage}
                                            source={
                                                item.id === '1'
                                                    ? require('../../assets/images/profile2.png')
                                                    : require('../../assets/images/profile1.png')
                                            }
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <MainText style={{ color: Colors.greenText }}>
                                            {item.name}
                                        </MainText>
                                        <MainText>{item.message}</MainText>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </View>
            </Root>
        );
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    box: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'gray',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 10,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height: 120,
    },
    intro: {},
    groups: {},
    modules: {},
    wall: {
        flex: 1,
        overflow: 'hidden',
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderRadius: 90 / 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderWidth: 2,
        borderColor: Colors.greenText,
        borderRadius: 90 / 2,
        overflow: 'hidden',
        marginHorizontal: 30,
        marginVertical: 10,
    },
    miniImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        borderRadius: 28 / 2,
    },
    miniImageContainer: {
        width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: Colors.greenText,
        borderRadius: 28 / 2,
        overflow: 'hidden',
        marginRight: 10,
        marginVertical: 5,
    },
    infoText: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 18,
    },
    title: {
        color: Colors.greenText,
        fontSize: 15,
        marginBottom: 5,
    },
    wallHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default withFirebase(ProfileScreen);
