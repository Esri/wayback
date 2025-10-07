import { MapActionButton } from '@components/MapView/MapActionButton';
import { CalciteIcon } from '@esri/calcite-components-react';
import React from 'react';

export const CopyLink = () => {
    const [hasCopied, setHasCopied] = React.useState(false);
    return (
        <MapActionButton
            showLoadingIndicator={false}
            disabled={false}
            topMarging={4}
            tooltip={'Copy link to clipboard'}
            onClickHandler={() => {
                navigator.clipboard.writeText(window.location.href);

                setHasCopied(true);

                setTimeout(() => {
                    setHasCopied(false);
                }, 1000);
            }}
        >
            {hasCopied ? (
                // check icon
                <CalciteIcon icon="check" scale="m" />
            ) : (
                // link icon
                <CalciteIcon icon="link" scale="m" />
            )}
        </MapActionButton>
    );
};
