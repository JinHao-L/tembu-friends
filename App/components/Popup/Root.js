import React, { Component } from 'react';
import { View } from 'react-native';

import Popup from './Popup';

class Root extends Component {
    render() {
        return (
            <View style={{ flex: 1 }} {...this.props}>
                {this.props.children}
                <Popup
                    ref={(c) => {
                        if (c) Popup.instance = c;
                    }}
                />
            </View>
        );
    }
}

export default Root;
