import React from 'react';
import renderer from 'react-test-renderer';

import AuthButton from '../AuthButton';

describe('<AuthButton/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<AuthButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
