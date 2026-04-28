/* Copyright 2024-2026 Esri
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

// import { CalciteSwitch } from '@esri/calcite-components-react';
// import React, { FC, useEffect, useRef } from 'react';

// type Props = {
//     /**
//      * emits when user click on the Switch button
//      * @returns
//      */
//     onChange: (checked: boolean) => void;
//     /**
//      * label text to be placed next to the switch button
//      */
//     label: string;
//     /**
//      * if true, the switch button should be checked
//      */
//     checked: boolean;
// };

// export const Switch: FC<Props> = ({ label, checked, onChange }) => {
//     // const props: { [key: string]: any } = {};

//     // if (checked) {
//     //     props['checked'] = true;
//     // }

//     return (
//         <div>
//             <CalciteSwitch
//                 onCalciteSwitchChange={(evt: any) => {
//                     onChange(evt.target?.checked);
//                 }}
//                 checked={checked || undefined}
//             />
//             <span className="text-sm ml-2">{label}</span>
//         </div>
//     );
// };
