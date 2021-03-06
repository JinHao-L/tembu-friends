import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Platform, ScrollView } from 'react-native';
import { ListItem, Button, Overlay } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';
import { MainText, ProfilePost } from 'components';
import { withFirebase } from 'helper/Firebase';
import Layout from '../../constant/Layout';

class ReportsControl extends Component {
    state = {
        isLoading: true,
        data: [],

        fetchingPost: false,

        visible: false,
        overlayData: null,
    };

    componentDidMount() {
        this.getPostReport();
    }

    getPostReport = () => {
        this.setState({ isLoading: true });
        return this.props.firebase
            .getPostReport()
            .then((data) => {
                this.setState({ data: data.sort((a, b) => a.date < b.date) });
            })
            .catch((error) => console.log('Get Post report', error))
            .finally(() => this.setState({ isLoading: false }));
    };

    renderItem = (item, index) => {
        return (
            <ListItem
                containerStyle={styles.reportContainer}
                onPress={this.state.fetchingPost ? undefined : () => this.showPost(item, index)}
            >
                <ListItem.Content style={styles.reportContentContainer}>
                    <ListItem.Title style={styles.title}>{'Report ' + item.postId}</ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                        {'Reported by: ' + item.reportedBy}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    };

    showPost = (post, index) => {
        this.setState({ fetchingPost: true });
        return this.props.firebase.getPost(post.uid, post.postId).then((data) => {
            this.setState({
                currPost: post,
                overlayData: data,
                dataIndex: index,
                visible: true,
                fetchingPost: false,
            });
        });
    };

    closePost = () => {
        this.setState({
            currPost: null,
            overlayData: null,
            dataIndex: null,
            visible: false,
        });
    };

    deletePost = (post, index) => {
        console.log(index);
        this.setState(
            {
                data: [...this.state.data.slice(0, index), ...this.state.data.slice(index + 1)],
            },
            () => this.props.firebase.deleteReportedPost(post)
        );
    };

    cancelReport = (post, index) => {
        console.log(index);

        this.setState(
            {
                data: [...this.state.data.slice(0, index), ...this.state.data.slice(index + 1)],
            },
            () => this.props.firebase.cancelReport(post)
        );
    };

    renderEmpty = () => (
        <View style={{ alignSelf: 'center', paddingTop: 10 }}>
            <MainText>No reported posts</MainText>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <Overlay
                    isVisible={this.state.visible}
                    animationType={'fade'}
                    animated={true}
                    overlayStyle={styles.overlayContainer}
                >
                    <View>
                        <MainText style={styles.popupTitle}>
                            {'To: ' + this.state.currPost?.writtenTo || 'User deleted'}
                        </MainText>
                        <ScrollView style={{ maxHeight: Layout.window.height / 2 }}>
                            <ProfilePost
                                postDetails={this.state.overlayData}
                                style={styles.separator}
                            />
                        </ScrollView>
                        <Button
                            title={'Delete Post'}
                            type={'clear'}
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                this.deletePost(this.state.currPost, this.state.dataIndex);
                                this.closePost();
                            }}
                            containerStyle={[
                                styles.buttonContainer,
                                Platform.OS === 'ios' && styles.separator,
                            ]}
                        />
                        <Button
                            title={'Cancel Report'}
                            type={'clear'}
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                this.cancelReport(this.state.currPost, this.state.dataIndex);
                                this.closePost();
                            }}
                            containerStyle={[
                                styles.buttonContainer,
                                Platform.OS === 'ios' && styles.separator,
                            ]}
                        />
                        <Button
                            title={'Close'}
                            type={'clear'}
                            titleStyle={styles.buttonText}
                            onPress={this.closePost}
                            containerStyle={[
                                styles.buttonContainer,
                                { borderBottomEndRadius: 20, borderBottomStartRadius: 20 },
                            ]}
                        />
                    </View>
                </Overlay>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    ListEmptyComponent={this.renderEmpty}
                    keyExtractor={(item) => item.postId}
                    refreshing={this.state.isLoading}
                    onRefresh={this.getPostReport}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    reportContainer: {
        borderBottomWidth: 3,
        borderColor: Colors.appGray2,
        paddingVertical: 15,
    },
    reportContentContainer: {
        paddingLeft: 5, //Align text to back-icon
    },
    title: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appGreen,
    },
    subtitle: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
        color: Colors.appBlack,
    },
    overlayContainer: {
        maxWidth: 400,
        width: 280,
        backgroundColor: Colors.appWhite,
        borderRadius: 20,
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginHorizontal: 0,
        overflow: 'hidden',
    },
    buttonContainer: {
        width: 280,
        borderRadius: 0,
    },
    buttonText: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    popupTitle: {
        fontWeight: '600',
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        paddingVertical: 10,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.appGray2,
    },
    separator: {
        borderColor: Colors.appGray2,
        borderBottomWidth: 1,
    },
});

export default withFirebase(ReportsControl);
