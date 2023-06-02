import React, { FC } from 'react';

type Props = {
    closeButtonOnClick: () => void;
};

export const DownloadDialog: FC<Props> = ({ closeButtonOnClick }: Props) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-custom-modal-background flex items-center justify-center z-50">
            <div className="max-w-lg mx-auto bg-custom-modal-content-background">
                <div className="text-right">
                    <calcite-button
                        icon-start="x"
                        appearance="transparent"
                        kind="neutral"
                        onClick={closeButtonOnClick}
                    />
                </div>
                this is the content
            </div>
        </div>
    );
};
