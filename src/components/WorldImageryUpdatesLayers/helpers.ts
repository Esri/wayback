import { ImageryUpdatesCategory } from '@services/world-imagery-updates/config';

const LayerTitleByCategory: Record<ImageryUpdatesCategory, string> = {
    'vivid-advanced': 'Maxar Vivid Advanced imagery',
    'vivid-standard': 'Maxar Vivid Standard imagery',
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
