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
import { AppContext } from '@contexts/AppContextProvider';

// interface IProps {
//     onClose: () => void;
// }
// interface IState {}

export const AboutThiAppContent: React.FC = () => {
    const githubRepoInfo = (
        <>
            The source code for this app is available on{' '}
            <a
                href="https://github.com/vannizhang/wayback"
                target="_blank"
                rel="noopener noreferrer"
            >
                Github
            </a>
            .
        </>
    );

    return (
        <>
            {/* <h2 className="text-3xl mb-4 text-center">World Imagery Wayback</h2> */}
            <h5 className="text-xl mb-3">WHAT</h5>
            <p className="mb-6">
                Wayback is a digital archive, providing users with access to the
                different versions of{' '}
                <a
                    href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    World Imagery
                </a>{' '}
                created over time. Each layer in the archive represents a
                snapshot of the entire World Imagery map, as it existed on the
                date it was published. Wayback currently provides access to all
                published versions of World Imagery, dating back to February 20,
                2014. There is an ArcGIS Online item for every version which can
                be accessed directly from this app or within the{' '}
                <a
                    href="https://www.arcgis.com/home/group.html?id=0f3189e1d1414edfad860b697b7d8311#settings"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Wayback Imagery group
                </a>
                . {githubRepoInfo}
            </p>

            <h5 className="text-xl mb-3">WHY</h5>
            <p className="mb-6">
                As World Imagery is updated with more current imagery, new
                versions of the map are published. When and where updates occur,
                the previous imagery is replaced and is no longer visible. For
                many use cases, the new imagery is more desirable and typically
                preferred. Other times, however, the previous imagery may
                support use cases that the new imagery does not. In these cases,
                a user may need to access a previous version of World Imagery.
            </p>

            <h5 className="text-xl mb-2">HOW</h5>
            <p className="mb-6">
                Available versions of the World Imagery map are presented within
                a timeline and as layers in a list. Versions that resulted in
                local changes are highlighted in bold white, and the layer
                currently selected is highlighted in blue. Point and click on
                the map for additional imagery details within the selected
                layer. One or more layers can be added to a queue and pushed to
                a new ArcGIS Online web map.
            </p>
        </>
    );
};

// export default About;
