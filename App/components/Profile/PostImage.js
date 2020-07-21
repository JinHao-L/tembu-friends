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
import { MAIN_FONT } from '../Commons';

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
                presentationStyle={'overFullScreen'}
            >
                <ImageViewer
                    imageUrls={[{ url: imgUrl }]}
                    index={0}
                    onCancel={() => setImgVisibility(false)}
                    renderHeader={() => (
                        <View style={styles.row}>
                            <Icon
                                name={'clear'}
                                onPress={() => setImgVisibility(false)}
                                color={Colors.appBlack}
                                containerStyle={{
                                    top: 50,
                                    left: 10,
                                    position: 'absolute',
                                    zIndex: 9999,
                                    backgroundColor: Colors.appWhite,
                                    borderRadius: 20,
                                }}
                            />
                            <Icon
                                name={'more-horiz'}
                                color={Colors.appWhite}
                                containerStyle={{
                                    top: 50,
                                    right: 10,
                                    position: 'absolute',
                                    zIndex: 9999,
                                    borderRadius: 20,
                                }}
                            />
                        </View>
                    )}
                    renderFooter={() => (
                        <ScrollView
                            style={{ maxHeight: Layout.window.height / 2 }}
                            contentContainerStyle={styles.caption}
                        >
                            {caption()}
                        </ScrollView>
                    )}
                    saveToLocalByLongPress={false}
                    footerContainerStyle={{ width: '100%' }}
                    renderIndicator={() => null}
                    enableSwipeDown={true}
                    backgroundColor={'rgba(0, 0, 0, 0.8)'}
                    loadingRender={() => <ActivityIndicator color={Colors.appWhite} />}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        resizeMode: 'cover',
    },
    caption: {
        width: Layout.window.width,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
});

export default PostImage;
