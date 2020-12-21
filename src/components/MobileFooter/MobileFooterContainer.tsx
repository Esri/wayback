import React from 'react'

import {
    useSelector,
    useDispatch
} from 'react-redux';
import { isGutterHideSelector, isSideBarHideSelector, isSideBarHideToggled } from '../../store/reducers/UI';

import MobileFooter from './MobileFooter'

const MobileFooterContainer = () => {
    const dispatch = useDispatch()
    const isGutterHide = useSelector(isGutterHideSelector);
    const isSideBarHide = useSelector(isSideBarHideSelector);

    return isSideBarHide ? (
        <MobileFooter 
            isGutterHide={isGutterHide}
            OnClick={()=>{
                dispatch(isSideBarHideToggled())
            }}
        />
    ) : null;
}

export default MobileFooterContainer
