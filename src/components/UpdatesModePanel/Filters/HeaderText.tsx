import { CalciteIcon, CalciteTooltip } from '@esri/calcite-components-react';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';

type Props = {
    title: string;
    tooltip: string;
};
export const HeaderText: FC<Props> = ({ title, tooltip }) => {
    if (!title) return null;

    const tooltipAnchorId = nanoid();

    return (
        <div className="relative flex items-center text-custom-theme-blue">
            <div className="flex items-center justify-center mr-1">
                <CalciteIcon
                    id={tooltipAnchorId}
                    icon="information"
                    scale="s"
                />

                <CalciteTooltip
                    referenceElement={tooltipAnchorId}
                    overlayPositioning="fixed"
                    placement="bottom-start"
                    closeOnClick={true}
                >
                    <div
                        className="max-w-[300px]"
                        dangerouslySetInnerHTML={{
                            __html: tooltip,
                        }}
                    ></div>
                </CalciteTooltip>
            </div>

            <h4 className=" text-xl ">{title}</h4>
        </div>
    );
};
