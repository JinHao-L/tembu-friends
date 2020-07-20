import React from 'react';
import { useHeaderHeight } from '@react-navigation/stack';

export const withHeight = (Component) => (props) => {
    const headerHeight = useHeaderHeight();
    return <Component headerHeight={headerHeight} {...props} />;
};
