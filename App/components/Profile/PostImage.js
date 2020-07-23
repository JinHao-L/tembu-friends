import React, { useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Platform,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from 'react-native-elements';

import { Layout, Colors } from '../../constants';

let ratio = 2 / 3;

function PostImage({ imgUrl, imgRatio, style, caption }) {
    ratio = imgRatio;
    const [imgVisibility, setImgVisibility] = useState(false);
    const [focus, setFocus] = useState(false);
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
                    renderHeader={
                        focus
                            ? undefined
                            : () => (
                                  <Icon
                                      name={'clear'}
                                      onPress={() => setImgVisibility(false)}
                                      color={Colors.appWhite}
                                      containerStyle={{
                                          top: Platform.OS === 'ios' ? 50 : 10,
                                          right: 10,
                                          position: 'absolute',
                                          zIndex: 9999,
                                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                          borderRadius: 20,
                                          padding: 2,
                                      }}
                                  />
                              )
                    }
                    onClick={() => setFocus(!focus)}
                    renderFooter={
                        focus
                            ? undefined
                            : () => (
                                  <View
                                      style={{
                                          paddingBottom: 50,
                                          paddingTop: 10,
                                          paddingHorizontal: 20,
                                      }}
                                  >
                                      {caption()}
                                  </View>
                              )
                    }
                    footerContainerStyle={{
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    renderIndicator={() => null}
                    enableSwipeDown={true}
                    backgroundColor={'rgba(0, 0, 0, 0.8)'}
                    loadingRender={() => <ActivityIndicator color={Colors.appWhite} />}
                    saveToLocalByLongPress={false}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        resizeMode: 'cover',
    },
    caption: {
        width: Layout.window.width,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
});

export default PostImage;
