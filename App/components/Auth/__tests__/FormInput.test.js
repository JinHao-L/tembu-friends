import React from 'react';
import renderer from 'react-test-renderer';

import FormInput from '../FormInput';

describe('<FormInput/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<FormInput />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
