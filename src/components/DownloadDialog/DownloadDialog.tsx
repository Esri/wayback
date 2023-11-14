import { DownloadJob } from '@store/DownloadMode/reducer';
import React, { FC } from 'react';
import { DownloadJobCard } from './DownloadJobCard';
import { DownloadJobPlaceholder } from './DownloadJobPlaceholder';

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
};

export const DownloadDialog: FC<Props> = ({
    jobs,
    isAddingNewDownloadJob,
    createTilePackageButtonOnClick,
    downloadTilePackageButtonOnClick,
    closeButtonOnClick,
    removeButtonOnClick,
    levelsOnChange,
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
        <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center z-50"
            style={{
                background: `radial-gradient(circle, rgba(26,61,96,0.95) 50%, rgba(13,31,49,0.95) 100%)`,
            }}
        >
            <div className="max-w-3xl mx-8 bg-custom-modal-content-background p-2 pb-8">
                <div className="text-right">
                    <calcite-button
                        icon-start="x"
                        appearance="transparent"
                        kind="neutral"
                        onClick={closeButtonOnClick}
                    />
                </div>

                <div className="px-8 max-h-[500px] min-h-[350px] overflow-y-auto fancy-scrollbar">
                    <h3 className="text-2xl mb-2">
                        Wayback Export (
                        <a
                            href="https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor22"
                            target="_blank"
                            rel="noreferrer"
                        >
                            beta
                        </a>
                        )
                    </h3>

                    <p className="text-sm mb-4">
                        Exported basemap tiles are intended for offline use in
                        ArcGIS applications and{' '}
                        <a
                            href="https://developers.arcgis.com/documentation/mapping-apis-and-services/offline/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            offline applications
                        </a>{' '}
                        built with an ArcGIS Runtime SDK, in accordance with
                        Esri’s terms of use:{' '}
                        <a
                            href="https://downloads2.esri.com/arcgisonline/docs/tou_summary.pdf"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Summary
                        </a>{' '}
                        |{' '}
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
                            Each export request is limited to a maximum of
                            150,000 tiles.
                        </li>
                        <li>
                            No more than five exports may be requested
                            concurrently.
                        </li>
                        <li>
                            This dialog can safely be closed while tile packages
                            are being created.
                        </li>
                    </ul>

                    <hr className="my-8 opacity-50" />

                    {isAddingNewDownloadJob && <DownloadJobPlaceholder />}

                    <div>{getJobsList()}</div>
                </div>
            </div>
        </div>
    );
};
