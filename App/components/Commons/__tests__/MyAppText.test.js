import React from 'react';
import renderer from 'react-test-renderer';

import { MainText, LogoText } from '../MyAppText';

describe('<MainText/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<MainText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('<LogoText/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<LogoText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
