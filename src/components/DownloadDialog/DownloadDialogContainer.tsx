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

import React, { FC, useEffect } from 'react';
import { useAppSelector } from '@store/configureStore';
import {
    downloadJobRemoved,
    // isDownloadDialogOpenToggled,
} from '@store/DownloadMode/reducer';

import {
    selectDownloadJobs,
    selectIsAddingNewDownloadJob,
    // selectIsDownloadDialogOpen,
    selectNumOfPendingDownloadJobs,
} from '@store/DownloadMode/selectors';

import { DownloadDialog } from './DownloadDialog';
import { useAppDispatch } from '@store/configureStore';
import { updateHashParams } from '@utils/UrlSearchParam';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';
import { saveDownloadJobs2LocalStorage } from '@utils/LocalStorage';
import {
    checkPendingDownloadJobStatus,
    startDownloadJob,
    updateUserSelectedZoomLevels,
    downloadOutputTilePackage,
    cleanUpDownloadJobs,
} from '@store/DownloadMode/thunks';
import {
    activeDialogUpdated,
    isDownloadTilePackageDialogOpenSelector,
} from '@store/UI/reducer';
import { Modal } from '@components/Modal/Modal';

export const DownloadDialogContainer = () => {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(isDownloadTilePackageDialogOpenSelector);

    const jobs = useAppSelector(selectDownloadJobs);

    const numPendingJobs = useAppSelector(selectNumOfPendingDownloadJobs);

    const isAddingNewDownloadJob = useAppSelector(selectIsAddingNewDownloadJob);

    useEffect(() => {
        // save jobs to localhost so they can be restored
        saveDownloadJobs2LocalStorage(jobs);

        // prompt anonymouns user to sign in if the user wants to open the download dialog,
        // since exporting job requires the user token
        if (jobs?.length && isAnonymouns() && isOpen) {
            signIn();
        }
    }, [jobs, isOpen]);

    useEffect(() => {
        updateHashParams('downloadMode', isOpen ? 'true' : null);
    }, [isOpen]);

    useEffect(() => {
        if (numPendingJobs) {
            dispatch(checkPendingDownloadJobStatus());
        }
    }, [numPendingJobs]);

    useEffect(() => {
        if (!isOpen) {
            dispatch(cleanUpDownloadJobs());
        }
    }, [isOpen]);

    const getTitle = () => {
        return (
            <span className="text-2xl mb-8">
                Wayback Export (
                <a
                    href="https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor22"
                    target="_blank"
                    rel="noreferrer"
                >
                    beta
                </a>
                )
            </span>
        );
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            title={getTitle()}
            isOpen={isOpen}
            // title="Download Tile Package"
            onClose={() => {
                dispatch(activeDialogUpdated());
            }}
            width="xl"
        >
            <DownloadDialog
                jobs={jobs}
                isAddingNewDownloadJob={isAddingNewDownloadJob}
                closeButtonOnClick={() => {
                    dispatch(activeDialogUpdated());
                }}
                removeButtonOnClick={(id) => {
                    dispatch(downloadJobRemoved(id));
                }}
                levelsOnChange={(id, levels) => {
                    // console.log(id, levels);
                    dispatch(updateUserSelectedZoomLevels(id, levels));
                }}
                createTilePackageButtonOnClick={(id: string) => {
                    dispatch(startDownloadJob(id));
                }}
                downloadTilePackageButtonOnClick={(id: string) => {
                    dispatch(downloadOutputTilePackage(id));
                }}
            />
        </Modal>
    );
};
