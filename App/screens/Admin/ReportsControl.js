import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { ListItem, Button, Overlay } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT, MainText } from '../../components';
import { withFirebase } from '../../helper/Firebase';
import ProfilePost from '../../components/Profile/ProfilePost';

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
            .then((data) => this.setState({ data }))
            .catch((error) => console.log('Get Post report', error))
            .finally(() => this.setState({ isLoading: false }));
    };

    renderSeparator = () => {
        return <View style={{ height: 1, backgroundColor: Colors.appGray4 }} />;
    };

    renderItem = (item, index) => {
        return (
            <ListItem
                title={item.postId}
                onPress={this.state.fetchingPost ? undefined : () => this.showPost(item, index)}
            />
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
        <View style={{ alignSelf: 'center' }}>
            <MainText>No reports</MainText>
        </View>
    );

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Overlay
                    isVisible={this.state.visible}
                    animationType={'fade'}
                    animated={true}
                    // fullScreen={true}
                    overlayStyle={styles.overlayContainer}
                >
                    <View>
                        <ProfilePost
                            postDetails={this.state.overlayData}
                            tapToExpandImage={false}
                        />
                        <Button
                            title={'Delete Post'}
                            type={'clear'}
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                this.deletePost(this.state.currPost, this.state.dataIndex);
                                this.closePost();
                            }}
                            containerStyle={styles.buttonContainer}
                        />
                        <Button
                            title={'Cancel Report'}
                            type={'clear'}
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                this.cancelReport(this.state.currPost, this.state.dataIndex);
                                this.closePost();
                            }}
                            containerStyle={styles.buttonContainer}
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
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    ListEmptyComponent={this.renderEmpty}
                    keyExtractor={(item) => item.postId}
                    refreshing={this.state.isLoading}
                    onRefresh={this.getPostReport}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        // backgroundColor: Colors.appWhite,
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
});

export default withFirebase(ReportsControl);
