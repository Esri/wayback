// /* Copyright 2024 Esri
//  *
//  * Licensed under the Apache License Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import React, { useContext } from 'react';

// import { useAppDispatch, useAppSelector } from '@store/configureStore';

// import {
//     activeDialogUpdated,
//     isSettingModalOpenSelector,
//     // isSettingModalOpenToggled,
//     // shouldOnlyShowItemsWithLocalChangeToggled,
// } from '@store/UI/reducer';

// import { selectMapCenterAndZoom } from '@store/Map/reducer';
// import SettingDialogContent from './SettingDialogContent';
// import { Modal } from '@components/Modal/Modal';
// import { useTranslation } from 'react-i18next';

// const SettingDialogContainer = () => {
//     const dispatch = useAppDispatch();

//     const { t } = useTranslation();

//     const mapCenterAndZoom = useAppSelector(selectMapCenterAndZoom);

//     const isOpen = useAppSelector(isSettingModalOpenSelector);

//     const onCloseHandler = () => {
//         dispatch(activeDialogUpdated());
//     };

//     return (
//         <Modal
//             title={t('settings')}
//             isOpen={isOpen}
//             width="m"
//             onClose={onCloseHandler}
//         >
//             <SettingDialogContent mapCenterAndZoom={mapCenterAndZoom} />
//         </Modal>
//     );
// };

// export default SettingDialogContainer;
