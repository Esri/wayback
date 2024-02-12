/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext } from 'react';

import {
    useSelector,
    useDispatch,
    batch,
    // batch
} from 'react-redux';

import { AppContext } from '@contexts/AppContextProvider';

import {
    activeWaybackItemSelector,
    previewWaybackItemSelector,
} from '@store/Wayback/reducer';

import { shouldShowPreviewItemTitleSelector } from '@store/UI/reducer';

import Title4ActiveItem from './index';

const Title4ActiveItemContainer = () => {
    const { isMobile } = useContext(AppContext);

    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const shouldShowPreviewItemTitle = useSelector(
        shouldShowPreviewItemTitleSelector
    );

    return (
        <Title4ActiveItem
            isMobile={isMobile}
            activeWaybackItem={activeWaybackItem}
            previewWaybackItem={previewWaybackItem}
            shouldShowPreviewItemTitle={shouldShowPreviewItemTitle}
        />
    );
};

export default Title4ActiveItemContainer;
