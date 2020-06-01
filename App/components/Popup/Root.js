import React, { Component } from 'react';
import { View } from 'react-native';

import Popup from './Popup';

class Root extends Component {
    render() {
        return (
            <View ref={(popup) => (this._root = popup)} style={{ flex: 1 }} {...this.props}>
                {this.props.children}
                <Popup
                    ref={(popup) => {
                        if (popup) Popup.instance = popup;
                    }}
                />
            </View>
        );
    }
}

export default Root;
