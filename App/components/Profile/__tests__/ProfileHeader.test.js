import React from 'react';
import renderer from 'react-test-renderer';

import ProfileHeader from '../ProfileHeader';

describe('<ProfileHeader/>', () => {
    const mockUser = {
        bannerImg: '',
        profileImg: '',
        displayName: 'Mock User',
        role: 'Jest',
        major: 'Jester',
        year: 'Y5',
        house: 'Shan',
        roomNumber: '#99-999',
        friendsCount: 999,
        aboutText: 'Just testing',
        moduleCodes: [],
        moduleNames: [],
        verified: true,
        statusType: 'green',
    };

    it('renders correctly', () => {
        const tree = renderer.create(<ProfileHeader userData={mockUser} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // it('Accessory button works', () => {
    //     const tree = renderer.create(<ProfileHeader userData={mockUser}/>).toJSON();
    //     expect(tree).toMatchSnapshot();
    // });
});
