import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react-native';

import MenuButton from '../MenuButton';

describe('<MenuButton/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<MenuButton type={'Friends'} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(<MenuButton type={'Friends'} onPress={onPressEvent} />);

        const button = component.getByTestId('MenuButton');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
