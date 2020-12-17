import React from 'react';

import {
    miscFns
} from 'helper-toolkit-ts';

type Props = {
    children: React.ReactNode
}

const isMobile = miscFns.isMobileDevice();

const MobileHide:React.FC<Props> = ({
    children
}) => {
    return !isMobile ? (
        <>
           { children } 
        </>
    ) : <></>;
}

export default MobileHide;
