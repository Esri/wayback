import React, { useEffect } from 'react';

import {
    useSelector,
    useDispatch,
    // batch
} from 'react-redux';

import {
    shouldOnlyShowItemsWithLocalChangeSelector,
    shouldOnlyShowItemsWithLocalChangeToggled,
} from '../../store/reducers/UI';
import { saveLocalChangesOnlyInURLQueryParam } from '../../utils/UrlSearchParam';

import ShowLocalChangesCheckboxToggle from './index';

const ShowLocalChangesCheckboxToggleContainer = () => {
    const dispatch = useDispatch();

    const shouldOnlyShowItemsWithLocalChange = useSelector(
        shouldOnlyShowItemsWithLocalChangeSelector
    );

    useEffect(() => {
        saveLocalChangesOnlyInURLQueryParam(shouldOnlyShowItemsWithLocalChange);
    }, [shouldOnlyShowItemsWithLocalChange]);

    return (
        <ShowLocalChangesCheckboxToggle
            isActive={shouldOnlyShowItemsWithLocalChange}
            onChange={() => {
                dispatch(shouldOnlyShowItemsWithLocalChangeToggled());
            }}
        />
    );
};

export default ShowLocalChangesCheckboxToggleContainer;
