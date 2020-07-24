import React from 'react';
import renderer from 'react-test-renderer';

import AppLogo from '../AppLogo';

describe('AppLogo', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<AppLogo />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it('renders correctly', () => {
        const tree = renderer.create(<AppLogo />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
