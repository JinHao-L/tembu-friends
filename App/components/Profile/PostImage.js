import React, { useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Modal,
    ActivityIndicator,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Layout, Colors } from '../../constants';
import { Icon } from 'react-native-elements';

let ratio = 2 / 3;

const PostImage = ({ imgUrl, imgRatio, style, caption }) => {
    ratio = imgRatio;
    const [imgVisibility, setImgVisibility] = useState(false);
    return (
        <View>
            <TouchableOpacity
                style={style}
                onPress={() => setImgVisibility(true)}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: imgUrl }}
                    resizeMode={'cover'}
                    style={[
                        styles.image,
                        {
                            aspectRatio: imgRatio < 1 ? 1 : imgRatio,
                        },
                    ]}
                />
            </TouchableOpacity>
            <Modal
                visible={imgVisibility}
                transparent={true}
                onRequestClose={() => setImgVisibility(false)}
            >
                <ImageViewer
                    imageUrls={[{ url: imgUrl }]}
                    index={0}
                    onCancel={() => setImgVisibility(false)}
                    renderHeader={() => (
                        <Icon
                            name={'clear'}
                            onPress={() => setImgVisibility(false)}
                            color={Colors.appWhite}
                            containerStyle={{
                                top: 5,
                                right: 5,
                                position: 'absolute',
                                zIndex: 9999,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: 20,
                            }}
                        />
                    )}
                    renderFooter={() => (
                        <ScrollView
                            style={{ maxHeight: Layout.window.height / 2 }}
                            contentContainerStyle={styles.caption}
                        >
                            {caption()}
                        </ScrollView>
                    )}
                    footerContainerStyle={{ width: '100%' }}
                    renderIndicator={() => null}
                    enableSwipeDown={true}
                    backgroundColor={'rgba(0,0,0, 0.8)'}
                    loadingRender={() => <ActivityIndicator color={Colors.appWhite} />}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    image: {
        width: '100%',
        resizeMode: 'cover',
    },
    caption: {
        width: Layout.window.width,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default PostImage;
