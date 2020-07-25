import React from 'react';
import renderer from 'react-test-renderer';

import TabBarIcon from '../TabBarIcon';

describe('<TabBarIcon/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<TabBarIcon name={'md-home'} focused={false} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
