import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    errorMessage: string;
};

export const ErrorPage: FC<Props> = ({ errorMessage }) => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div>
                <p>The application has encountered an error:</p>
                <p className="mt-2">{errorMessage}</p>
            </div>
        </div>
    );
};
