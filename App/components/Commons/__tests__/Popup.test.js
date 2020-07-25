import React from 'react';
import renderer from 'react-test-renderer';

import Popup from '../Popup';
import { fireEvent, render } from 'react-native-testing-library';

describe('<Popup/>', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Popup isVisible={true} title={'title'} body={'body'} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('onPress functionality works', () => {
        const onPressEvent = jest.fn();

        onPressEvent.mockReturnValue('Link on press invoked');

        const component = render(
            <Popup
                isVisible={true}
                title={'title'}
                body={'body'}
                buttonText={'Cancel'}
                callback={onPressEvent}
            />
        );

        const button = component.getByTestId('lastButton');
        fireEvent.press(button);

        expect(onPressEvent).toHaveBeenCalled();
    });
});
