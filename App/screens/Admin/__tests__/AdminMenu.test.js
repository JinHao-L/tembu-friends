import React from 'react';
import renderer from 'react-test-renderer';

import AdminMenu from '../AdminMenu';

describe('<AdminMenu/>', () => {
    const tree = renderer.create(<AdminMenu />).toJSON();
    it('has 1 child', () => {
        expect(tree.children.length).toBe(1);
    });

    it('renders correctly', () => {
        expect(tree).toMatchSnapshot();
    });
    //
    // it('has 2 menu items', () => {
    //     expect(tree.children.length).toBe(1);
    // });
});
