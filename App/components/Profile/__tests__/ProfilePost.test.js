import React from 'react';
import renderer from 'react-test-renderer';
jest.mock('react-native-image-zoom-viewer');

import ProfilePost from '../ProfilePost';

describe('<ProfilePost/>', () => {
    const mockDateFn = () => new Date(1466424490000);

    const mockTimestamp = {
        toDate: mockDateFn,
    };

    const mockPost = {
        body: 'TESTING',
        is_private: true,
        sender_name: 'Mock User',
        sender_uid: '12345',
        time_posted: mockTimestamp,
        post_id: '1234',
        reported: false,
    };

    it('renders correctly', () => {
        const tree = renderer.create(<ProfilePost postDetails={mockPost} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
