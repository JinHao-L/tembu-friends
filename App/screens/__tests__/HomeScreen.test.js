import renderer from 'react-test-renderer';
import HomeScreen from '../HomeScreen';
import React from 'react';

describe('<HomeScreen/>', () => {
    jest.mock('react-native-webview', () => 'WebView');

    it('has 1 child', () => {
        const tree = renderer.create(<HomeScreen />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', () => {
        const tree = renderer.create(<HomeScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
