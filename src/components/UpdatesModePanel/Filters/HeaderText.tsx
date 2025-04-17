import React, { FC } from 'react';

type Props = {
    title: string;
};
export const HeaderText: FC<Props> = ({ title }) => {
    if (!title) return null;

    return <h4 className="text-custom-theme-blue text-xl mb-2">{title}</h4>;
};
