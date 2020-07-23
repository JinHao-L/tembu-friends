import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

jest.mock('./navigation/RootNav', () => () => 'RootNav');

describe('<App/>', () => {
    it('App renders without crashing', () => {
        const rendered = renderer.create(<App />).toJSON();
        expect(rendered).toBeTruthy();
    });

    it('Renders correctly', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
