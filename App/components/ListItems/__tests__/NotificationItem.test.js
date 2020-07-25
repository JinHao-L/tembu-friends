import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from 'react-native-testing-library';

import NotificationItem from '../NotificationItem';

describe('<NotificationItem/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<NotificationItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(<NotificationItem onPress={onPressEvent} />);

        const button = component.getByTestId('listitem');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
