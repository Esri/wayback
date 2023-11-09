import React from 'react';

export const DownloadJobPlaceholder = () => {
    return (
        <div className="mb-3">
            <div className="w-full h-[57px] bg-white bg-opacity-10 px-2 text-center flex items-center justify-center">
                <calcite-loader scale="s" />
            </div>
        </div>
    );
};
