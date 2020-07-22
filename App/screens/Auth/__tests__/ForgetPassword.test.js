import 'react-native';
import React from 'react';
import ForgetPassword from '../ForgetPassword';

import renderer from 'react-test-renderer';

describe('<ForgetPassword/>', () => {
    const tree = renderer.create(<ForgetPassword />).toJSON();

    it('renders correctly', () => {
        expect(tree).toMatchSnapshot();
    });

    it('has 1 child', () => {
        expect(tree.children.length).toBe(1);
    });
});
