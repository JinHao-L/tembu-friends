import React from 'react';
import renderer from 'react-test-renderer';

import UserItem from '../UserItem';

describe('<UserItem/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<UserItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
