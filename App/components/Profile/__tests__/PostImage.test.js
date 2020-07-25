import React from 'react';
import renderer from 'react-test-renderer';
jest.mock('react-native-image-zoom-viewer');

import PostImage from '../PostImage';

describe('<PostImage/>', () => {
    const mockFn = jest.fn(() => 'Caption');
    const tree = renderer.create(<PostImage caption={mockFn} />).toJSON();

    it('renders correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
