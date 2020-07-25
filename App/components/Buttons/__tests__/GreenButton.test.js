import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from 'react-native-testing-library';

import GreenButton from '../GreenButton';

describe('<GreenButton/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<GreenButton title={'button'} type={'solid'} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(
            <GreenButton title={'button'} type={'solid'} onPress={onPressEvent} />
        );

        const button = component.getByTestId('GreenButton');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
