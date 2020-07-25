import React from 'react';
import renderer from 'react-test-renderer';

import NotificationItem from '../NotificationItem';

describe('<NotificationItem/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<NotificationItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
