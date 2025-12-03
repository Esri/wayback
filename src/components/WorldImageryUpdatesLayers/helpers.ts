import {
    ImageryUpdatesCategory,
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol.js';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';

const LayerTitleByCategory: Record<ImageryUpdatesCategory, string> = {
    'vivid-advanced': 'Vantor Vivid Advanced imagery',
    'vivid-standard': 'Vantor Vivid Standard imagery',
    'community-contributed': 'Community Maps imagery',
};

export const getPopupTemplate = (
    category: ImageryUpdatesCategory
): __esri.PopupTemplateProperties => {
    const layerTitle = LayerTitleByCategory[category];

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
                    var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var strDate = monthList[Month($feature.PubDate)] + " " + Day($feature.PubDate) + ", " + Year($feature.PubDate);
                    var pubQY = when(
                        Month($feature.PubDate) <= 2, "Q1 " + Year($feature.PubDate),
                        Month($feature.PubDate) <= 5, "Q2 " + Year($feature.PubDate),
                        Month($feature.PubDate) <= 8, "Q3 " + Year($feature.PubDate),
                        Month($feature.PubDate) <= 11, "Q4 " + Year($feature.PubDate),
                        Year($feature.PubDate)
                    );
                    if ($feature.PubState == 'Pending') {
                        return "${layerTitle} for this area is scheduled to be published in " + pubQY + ".";
                    } else if ($feature.PubState == 'Published') {
                        return "${layerTitle} for this area was published on " + strDate + ".";
                    }
                `,
                returnType: 'string',
            },
            {
                name: 'expr2',
                title: 'ImageResolution',
                expression: `
                    "Pixels in this imagery represent a ground distance of " + Round($feature.GSD, 2) + " meters.";
                `,
                returnType: 'string',
            },
        ],
        title: '{expression/expr0}',
        content: `<p><strong><u>Publication</u>:</strong>&nbsp;&nbsp;{expression/expr1}<br /><strong><u>Resolution</u>:</strong>&nbsp; &nbsp;{expression/expr2}</p>`,
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
                                            .published.fillColorArray,
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
                                                        .fillColorArray,
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
                                            .pending.fillColorArray,
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
                                                        .pending.fillColorArray,
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
