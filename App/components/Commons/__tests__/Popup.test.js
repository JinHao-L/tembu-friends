import React from 'react';
import renderer from 'react-test-renderer';

import Popup from '../Popup';

describe('<Popup/>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Popup isVisible={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
