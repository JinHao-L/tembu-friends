import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from 'react-native-testing-library';

import AuthButton from '../AuthButton';

describe('<AuthButton/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<AuthButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(<AuthButton onPress={onPressEvent} />);

        const button = component.getByTestId('AuthButton');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
