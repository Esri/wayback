import { DownloadJob } from '@store/DownloadMode/reducer';
import React, { FC } from 'react';
import { DownloadJobCard } from './DownloadJobCard';

type Props = {
    /**
     * list of donwload jobs
     */
    jobs: DownloadJob[];
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
    createTilePackageButtonOnClick,
    downloadTilePackageButtonOnClick,
    closeButtonOnClick,
    removeButtonOnClick,
    levelsOnChange,
}: Props) => {
    const getJobsList = () => {
        if (!jobs?.length) {
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
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-custom-modal-background flex items-center justify-center z-50">
            <div className="max-w-3xl mx-8 min-h-[350px] bg-custom-modal-content-background p-2 pb-8">
                <div className="text-right">
                    <calcite-button
                        icon-start="x"
                        appearance="transparent"
                        kind="neutral"
                        onClick={closeButtonOnClick}
                    />
                </div>

                <div className="px-8 max-h-[500px] overflow-y-auto fancy-scrollbar">
                    <h3 className="text-2xl mb-2">Download Local Tile Cache</h3>

                    <p className="text-sm mb-4">
                        Based on your current map extent, choose a scale range
                        for your download. Downloads are limited to 150,000
                        tiles.
                        {/* You can choose this window while your tiles are prepared. */}
                    </p>

                    <div>{getJobsList()}</div>
                </div>
            </div>
        </div>
    );
};
