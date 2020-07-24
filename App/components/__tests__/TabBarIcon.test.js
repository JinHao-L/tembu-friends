import React from 'react';
import renderer from 'react-test-renderer';

import TabBarIcon from '../TabBarIcon';

describe('TabBarIcon', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<TabBarIcon name={'md-home'} focused={false} />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it('renders correctly', () => {
        const tree = renderer.create(<TabBarIcon name={'md-home'} focused={false} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
