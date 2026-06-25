/* Copyright 2024-2026 Esri
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

import {
    ImageryUpdatesCategory,
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol.js';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';
import { PopupTemplateProperties } from '@arcgis/core/PopupTemplate';
import { t } from 'i18next';

const LayerTitleByCategory: Record<ImageryUpdatesCategory, string> = {
    'vivid-advanced': 'Vantor Vivid Advanced imagery',
    'vivid-standard': 'Vantor Vivid Standard imagery',
    'community-contributed': 'Community Maps imagery',
};

export const getPopupTemplate = (
    category: ImageryUpdatesCategory
): PopupTemplateProperties => {
    const layerTitle = LayerTitleByCategory[category];

    /**
     * `pubQY` and `strDate` are Arcade variables computed at runtime inside the expression below,
     * so they can't be passed through i18next as real values. Instead we splice the literal Arcade
     * concatenation syntax (`" + pubQY + "`) in as the interpolated value, with escaping disabled,
     * so translators can still reposition the variable within the sentence for their locale.
     */
    const pendingMessage = t('popup_pub_result_pending', {
        layerTitle,
        pubQY: '" + pubQY + "',
        interpolation: { escapeValue: false },
    });
    const publishedMessage = t('popup_pub_result_published', {
        layerTitle,
        strDate: '" + strDate + "',
        interpolation: { escapeValue: false },
    });
    const resolutionMessage = t('popup_image_resolution', {
        resolution: '" + Round($feature.GSD, 2) + "',
        interpolation: { escapeValue: false },
    });

    return {
        expressionInfos: [
            {
                name: 'expr0',
                title: 'Area_Country',
                expression: `
                    var cAreaName = Replace($feature.AreaName, '_', ' ');
                    var cCountryName = Replace($feature.CountryName, '_', ' ');
                    return cAreaName + ", " + cCountryName;
                `,
                returnType: 'string',
            },
            {
                name: 'expr1',
                title: 'PubResult',
                expression: `
                    var monthList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                    var utcDate = ToUTC($feature.PubDate);
                    var strDate =Year(utcDate) + "-" + monthList[Month(utcDate)] + "-" + Day(utcDate);
                    var pubQY = when(
                        Month(utcDate) <= 2, "Q1 " + Year(utcDate),
                        Month(utcDate) <= 5, "Q2 " + Year(utcDate),
                        Month(utcDate) <= 8, "Q3 " + Year(utcDate),
                        Month(utcDate) <= 11, "Q4 " + Year(utcDate),
                        Year(utcDate)
                    );
                    if ($feature.PubState == 'Pending') {
                        return "${pendingMessage}";
                    } else if ($feature.PubState == 'Published') {
                        return "${publishedMessage}";
                    }
                `,
                returnType: 'string',
            },
            {
                name: 'expr2',
                title: 'ImageResolution',
                expression: `
                    "${resolutionMessage}";
                `,
                returnType: 'string',
            },
        ],
        title: '{expression/expr0}',
        content: `<p><strong><u>${t('publication')}</u>:</strong>&nbsp;&nbsp;{expression/expr1}<br /><strong><u>${t('resolution')}</u>:</strong>&nbsp; &nbsp;{expression/expr2}</p>`,
    };
};

export const getUniqueValueRenderer4WorldImageryUpdates =
    (): UniqueValueRenderer => {
        return new UniqueValueRenderer({
            field: WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
            uniqueValueInfos: [
                {
                    value: WorldImageryUpdatesStatusEnum.published,
                    label: WorldImageryUpdatesStatusEnum.published,
                    // symbol: {
                    //     color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS.published
                    //         .fill, // Converted to RGB
                    //     type: 'simple-fill',
                    //     style: 'solid',
                    //     outline: {
                    //         type: 'simple-line',
                    //         color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                    //             .published.outline,
                    //         width: '3px',
                    //         style: 'solid',
                    //     },
                    // },
                    symbol: new CIMSymbol({
                        data: {
                            type: 'CIMSymbolReference',
                            symbol: {
                                type: 'CIMPolygonSymbol',
                                symbolLayers: [
                                    {
                                        type: 'CIMSolidStroke',
                                        enable: true,
                                        capStyle: 'Round',
                                        joinStyle: 'Round',
                                        // "lineStyle3D": "Strip",
                                        miterLimit: 10,
                                        width: 1.5,
                                        color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                            .published.fillColorArray as [
                                            number,
                                            number,
                                            number,
                                            number,
                                        ],
                                    },
                                    {
                                        type: 'CIMHatchFill',
                                        enable: true,
                                        lineSymbol: {
                                            type: 'CIMLineSymbol',
                                            symbolLayers: [
                                                {
                                                    type: 'CIMSolidStroke',
                                                    enable: true,
                                                    capStyle: 'Butt',
                                                    joinStyle: 'Miter',
                                                    // "lineStyle3D": "Strip",
                                                    miterLimit: 10,
                                                    width: 1.5,
                                                    color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                                        .published
                                                        .fillColorArray as [
                                                        number,
                                                        number,
                                                        number,
                                                        number,
                                                    ],
                                                },
                                            ],
                                        },
                                        rotation: 45,
                                        separation: 5,
                                    },
                                ],
                            },
                        },
                    }),
                },
                {
                    value: WorldImageryUpdatesStatusEnum.pending,
                    label: WorldImageryUpdatesStatusEnum.pending,
                    // symbol: {
                    //     color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS.pending
                    //         .fill, // Converted to RGB
                    //     type: 'simple-fill',
                    //     style: 'solid',
                    //     outline: {
                    //         type: 'simple-line',
                    //         color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                    //             .pending.outline,
                    //         width: '3px',
                    //         style: 'solid',
                    //     },
                    // },
                    symbol: new CIMSymbol({
                        data: {
                            type: 'CIMSymbolReference',
                            symbol: {
                                type: 'CIMPolygonSymbol',
                                symbolLayers: [
                                    {
                                        type: 'CIMSolidStroke',
                                        enable: true,
                                        capStyle: 'Round',
                                        joinStyle: 'Round',
                                        // "lineStyle3D": "Strip",
                                        miterLimit: 10,
                                        width: 1.5,
                                        color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                            .pending.fillColorArray as [
                                            number,
                                            number,
                                            number,
                                            number,
                                        ],
                                    },
                                    {
                                        type: 'CIMHatchFill',
                                        enable: true,
                                        lineSymbol: {
                                            type: 'CIMLineSymbol',
                                            symbolLayers: [
                                                {
                                                    type: 'CIMSolidStroke',
                                                    enable: true,
                                                    capStyle: 'Butt',
                                                    joinStyle: 'Miter',
                                                    // "lineStyle3D": "Strip",
                                                    miterLimit: 10,
                                                    width: 1.5,
                                                    color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                                        .pending
                                                        .fillColorArray as [
                                                        number,
                                                        number,
                                                        number,
                                                        number,
                                                    ],
                                                },
                                            ],
                                        },
                                        rotation: 315,
                                        separation: 5,
                                    },
                                ],
                            },
                        },
                    }),
                },
            ],
        });
    };

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Formats a Date object into a UTC timestamp string suitable for query filters.
 * @param date - The date to format.
 * @returns A string in the format `YYYY-MM-DD 00:00:00.000`.
 */
export const formatTimestamp = (date: Date): string => {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} 00:00:00.000`;
};

/**
 * Returns a new Date shifted by the given number of days from the provided date.
 * @param date - The starting date.
 * @param days - Number of days to shift (positive to go forward, negative to go back).
 * @returns A new Date offset by the specified number of days.
 */
export const shiftDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};
