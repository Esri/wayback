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

import { DownloadJob } from '@store/DownloadMode/reducer';
import React, { FC } from 'react';
import { DownloadJobCard } from './DownloadJobCard';
import { DownloadJobPlaceholder } from './DownloadJobPlaceholder';
import { CalciteButton } from '@esri/calcite-components-react';
import { Modal } from '@components/Modal/Modal';
import classNames from 'classnames';
import { Trans } from 'react-i18next';

type Props = {
    /**
     * list of donwload jobs
     */
    jobs: DownloadJob[];
    /**
     * if true, the system is in process of adding a new download job and
     * a placeholder card should be displayed
     */
    isAddingNewDownloadJob: boolean;
    /**
     * if true, the dialog is disabled (user not signed in or adding new job)
     */
    disabled?: boolean;
    /**
     * if true, the user is not signed in and should be prompted to sign in
     */
    promptToSignIn: boolean;
    /**
     * if true, the user is signed in with an ArcGIS public account and should be prompted to sign in with an organizational account
     * to access download features
     */
    promptToSignInWithOrgAccount: boolean;
    /**
     * fires when user clicks on the create tile package button to start the download job
     * @param id job id
     * @returns
     */
    createTilePackageButtonOnClick: (id: string) => void;
    /**
     * fires when user clicks on the download tile package button
     * @param gpJobId geoprocessing job id
     * @returns
     */
    downloadTilePackageButtonOnClick: (gpJobId: string) => void;
    /**
     * fires when close button is clicked
     * @returns
     */
    closeButtonOnClick: () => void;
    /**
     * fires when user clicks on the remove button to delete the download job
     * @param id job id
     * @returns
     */
    removeButtonOnClick: (id: string) => void;
    /**
     * fires when user makes changes to the selected zoom levels using the slider
     * @param levels
     * @returns void
     */
    levelsOnChange: (id: string, levels: number[]) => void;
    /**
     * Sign in button click handler
     * @returns void
     */
    signInButtonOnClick: () => void;
};

export const DownloadDialog: FC<Props> = ({
    jobs,
    isAddingNewDownloadJob,
    disabled,
    promptToSignIn,
    promptToSignInWithOrgAccount,
    createTilePackageButtonOnClick,
    downloadTilePackageButtonOnClick,
    closeButtonOnClick,
    removeButtonOnClick,
    levelsOnChange,
    signInButtonOnClick,
}: Props) => {
    const getJobsList = () => {
        if (!jobs?.length && !isAddingNewDownloadJob) {
            return <div className="text-center my-8">No download jobs.</div>;
        }

        return jobs.map((job) => {
            const { id } = job;
            return (
                <div key={id} className="mb-3">
                    <DownloadJobCard
                        data={job}
                        createTilePackageButtonOnClick={
                            createTilePackageButtonOnClick
                        }
                        downloadTilePackageButtonOnClick={
                            downloadTilePackageButtonOnClick
                        }
                        removeButtonOnClick={removeButtonOnClick}
                        levelsOnChange={levelsOnChange}
                    />
                </div>
            );
        });
    };

    return (
        <div className="mt-2">
            <div className="max-h-[500px] min-h-[350px] overflow-y-auto fancy-scrollbar">
                {(promptToSignIn || promptToSignInWithOrgAccount) && (
                    <p className="mb-4">
                        <Trans
                            i18nKey={
                                promptToSignIn
                                    ? 'sign_in_prompt_download_panel'
                                    : 'sign_in_with_org_account_prompt_download_panel'
                            }
                            components={{
                                action: (
                                    <span
                                        className="font-medium underline cursor-pointer text-custom-theme-blue-light"
                                        onClick={() => {
                                            // console.log('Sign in clicked')
                                            if (signInButtonOnClick) {
                                                signInButtonOnClick();
                                            }
                                        }}
                                    />
                                ),
                            }}
                        />
                    </p>
                )}

                <p className="text-sm mt-2 mb-4">
                    Exported basemap tiles are intended for offline use in
                    ArcGIS applications and{' '}
                    <a
                        href="https://developers.arcgis.com/documentation/mapping-apis-and-services/offline/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        offline applications
                    </a>{' '}
                    built with an ArcGIS Runtime SDK in accordance with Esri’s
                    terms of use:{' '}
                    <a
                        href="https://downloads2.esri.com/arcgisonline/docs/tou_summary.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Summary
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://www.esri.com/en-us/legal/terms/full-master-agreement"
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Terms of Use
                    </a>
                    .
                    {/* You can choose this window while your tiles are prepared. */}
                </p>

                <ul className="list-inside list-disc text-sm">
                    <li>
                        Exports are based on map extent, with a minimum zoom
                        level of 12.
                    </li>
                    <li>
                        Each export request is limited to a maximum of 150,000
                        tiles.
                    </li>
                    <li>
                        No more than five exports may be requested concurrently.
                    </li>
                    <li>
                        This dialog can safely be closed while tile packages are
                        being created.
                    </li>
                </ul>

                <hr className="my-8 opacity-50" />

                {isAddingNewDownloadJob && <DownloadJobPlaceholder />}

                <div
                    className={classNames({
                        disabled: disabled,
                    })}
                >
                    {getJobsList()}
                </div>
            </div>
        </div>
    );
};
