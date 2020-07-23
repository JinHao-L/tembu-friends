import React from 'react';
import renderer from 'react-test-renderer';

import AdminMenu from '../AdminMenu';

describe('<AdminMenu/>', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<AdminMenu />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it('renders correctly', () => {
        const tree = renderer.create(<AdminMenu />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    //
    // it('has 2 menu items', () => {
    //     expect(tree.children.length).toBe(1);
    // });
});
