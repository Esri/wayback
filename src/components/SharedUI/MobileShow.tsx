import React from 'react';

import { miscFns } from 'helper-toolkit-ts';

type Props = {
    children: React.ReactNode;
};

const isMobile = miscFns.isMobileDevice();

const MobileShow: React.FC<Props> = ({ children }) => {
    return isMobile ? <>{children}</> : null;
};

export default MobileShow;
