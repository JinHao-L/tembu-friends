import React from 'react';
import renderer from 'react-test-renderer';

import SearchBar from '../SearchBar';

describe('<SearchBar/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<SearchBar value={'text'} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
