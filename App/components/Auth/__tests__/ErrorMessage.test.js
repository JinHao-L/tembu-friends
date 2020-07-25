import React from 'react';
import renderer from 'react-test-renderer';

import ErrorMessage from '../ErrorMessage';

describe('<ErrorMessage/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<ErrorMessage />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
