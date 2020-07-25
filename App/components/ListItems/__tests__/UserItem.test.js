import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from 'react-native-testing-library';

import UserItem from '../UserItem';

describe('<UserItem/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<UserItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(<UserItem onPress={onPressEvent} />);

        const button = component.getByTestId('UserItem');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
