import React from 'react';

import {
    useSelector,
    useDispatch,
    // batch
} from 'react-redux';

import {
    shouldOnlyShowItemsWithLocalChangeSelector,
    shouldOnlyShowItemsWithLocalChangeToggled
} from '../../store/reducers/UI';

import ShowLocalChangesCheckboxToggle from './index';

const ShowLocalChangesCheckboxToggleContainer = () => {

    const dispatch = useDispatch();

    const shouldOnlyShowItemsWithLocalChange = useSelector(shouldOnlyShowItemsWithLocalChangeSelector)

    return (
        <ShowLocalChangesCheckboxToggle 
            isActive={shouldOnlyShowItemsWithLocalChange}
            onChange={()=>{
                dispatch(shouldOnlyShowItemsWithLocalChangeToggled())
            }}
        />
    )
}

export default ShowLocalChangesCheckboxToggleContainer
