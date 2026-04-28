/* Copyright 2024 Esri
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

export enum ReferenceLayerLanguage {
    Arabic = 'Arabic',
    Bosnian = 'Bosnian',
    Catalan = 'Catalan',
    ChineseSimplified = 'Chinese (Simplified)',
    ChineseTaiwan = 'Chinese (Taiwan)',
    ChineseHongKong = 'Chinese (Hong Kong)',
    Czech = 'Czech',
    Danish = 'Danish',
    Dutch = 'Dutch',
    Estonian = 'Estonian',
    EnglishUS = 'English (US)',
    English = 'English',
    Finnish = 'Finnish',
    French = 'French',
    German = 'German',
    Greek = 'Greek',
    Hungarian = 'Hungarian',
    Indonesian = 'Indonesian',
    Italian = 'Italian',
    Japanese = 'Japanese',
    Korean = 'Korean',
    Latvian = 'Latvian',
    Lithuanian = 'Lithuanian',
    Norwegian = 'Norwegian',
    Polish = 'Polish',
    PortugueseBrazil = 'Portuguese (Brazil)',
    PortuguesePortugal = 'Portuguese (Portugal)',
    Romanian = 'Romanian',
    Russian = 'Russian',
    Serbian = 'Serbian',
    Slovak = 'Slovak',
    Slovenian = 'Slovenian',
    Spanish = 'Spanish',
    Swedish = 'Swedish',
    Thai = 'Thai',
    Turkish = 'Turkish',
    Ukrainian = 'Ukrainian',
    Vietnamese = 'Vietnamese',
    Hebrew = 'Hebrew',
    Bulgarian = 'Bulgarian',
    // LocalLanguage = 'Local Language',
}

export const navigatorLanguageToReferenceLayerLanguage: {
    [key: string]: ReferenceLayerLanguage;
} = {
    ar: ReferenceLayerLanguage.Arabic,
    bs: ReferenceLayerLanguage.Bosnian,
    ca: ReferenceLayerLanguage.Catalan,
    'zh-CN': ReferenceLayerLanguage.ChineseSimplified,
    'zh-TW': ReferenceLayerLanguage.ChineseTaiwan,
    'zh-HK': ReferenceLayerLanguage.ChineseHongKong,
    cs: ReferenceLayerLanguage.Czech,
    da: ReferenceLayerLanguage.Danish,
    nl: ReferenceLayerLanguage.Dutch,
    et: ReferenceLayerLanguage.Estonian,
    en: ReferenceLayerLanguage.EnglishUS,
    fi: ReferenceLayerLanguage.Finnish,
    fr: ReferenceLayerLanguage.French,
    de: ReferenceLayerLanguage.German,
    el: ReferenceLayerLanguage.Greek,
    hu: ReferenceLayerLanguage.Hungarian,
    id: ReferenceLayerLanguage.Indonesian,
    it: ReferenceLayerLanguage.Italian,
    ja: ReferenceLayerLanguage.Japanese,
    ko: ReferenceLayerLanguage.Korean,
    lv: ReferenceLayerLanguage.Latvian,
    lt: ReferenceLayerLanguage.Lithuanian,
    no: ReferenceLayerLanguage.Norwegian,
    pl: ReferenceLayerLanguage.Polish,
    'pt-BR': ReferenceLayerLanguage.PortugueseBrazil,
    'pt-PT': ReferenceLayerLanguage.PortuguesePortugal,
    ro: ReferenceLayerLanguage.Romanian,
    ru: ReferenceLayerLanguage.Russian,
    sr: ReferenceLayerLanguage.Serbian,
    sk: ReferenceLayerLanguage.Slovak,
    sl: ReferenceLayerLanguage.Slovenian,
    es: ReferenceLayerLanguage.Spanish,
    sv: ReferenceLayerLanguage.Swedish,
    th: ReferenceLayerLanguage.Thai,
    tr: ReferenceLayerLanguage.Turkish,
    uk: ReferenceLayerLanguage.Ukrainian,
    vi: ReferenceLayerLanguage.Vietnamese,
    he: ReferenceLayerLanguage.Hebrew,
    bg: ReferenceLayerLanguage.Bulgarian,
    // Add more mappings as needed
};

export type ReferenceLayerData = {
    id: string;
    title: string;
    language: ReferenceLayerLanguage;
    languageCode: string;
    url: string;
};

/**
 * list of hybrid reference layers in different languages
 */
export const HYBRID_REFERENCE_LAYERS: ReferenceLayerData[] = [
    // {
    //     id: '2a2e806e6e654ea78ecb705149ceae9f',
    //     title: 'Hybrid Reference Layer (Local Language)',
    //     language: ReferenceLayerLanguage.LocalLanguage,
    //     url: `https://www.arcgis.com/sharing/rest/content/items/2a2e806e6e654ea78ecb705149ceae9f/resources/styles/root.json`,
    // },
    {
        id: '5447e9aef0684ec391ae9381725f7370',
        title: 'Hybrid Reference Layer (English-US)',
        language: ReferenceLayerLanguage.EnglishUS,
        languageCode: 'en',
        url: `https://www.arcgis.com/sharing/rest/content/items/5447e9aef0684ec391ae9381725f7370/resources/styles/root.json`,
    },
    {
        id: 'cd1d774669c741699063fe6b13f7dbe9',
        title: 'Hybrid Reference Layer (English)',
        language: ReferenceLayerLanguage.English,
        languageCode: 'en',
        url: `https://www.arcgis.com/sharing/rest/content/items/cd1d774669c741699063fe6b13f7dbe9/resources/styles/root.json`,
    },
    {
        id: 'd759386cc27342c580ff2ac5eb60ea9b',
        title: 'Hybrid Reference Layer (Arabic)',
        language: ReferenceLayerLanguage.Arabic,
        languageCode: 'ar',
        url: `https://www.arcgis.com/sharing/rest/content/items/d759386cc27342c580ff2ac5eb60ea9b/resources/styles/root.json`,
    },
    {
        id: '1ca897d33eca41e7b2632e3ff44a8542',
        title: 'Hybrid Reference Layer (Bosnian)',
        language: ReferenceLayerLanguage.Bosnian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/1ca897d33eca41e7b2632e3ff44a8542/resources/styles/root.json`,
    },
    {
        id: 'b44c4179c1e445719079d71384813211',
        title: 'Hybrid Reference Layer (Catalan)',
        language: ReferenceLayerLanguage.Catalan,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/b44c4179c1e445719079d71384813211/resources/styles/root.json`,
    },
    {
        id: '1c62ff85a58e4106a7e6c28d08449384',
        title: 'Hybrid Reference Layer (Chinese (Simplified))',
        language: ReferenceLayerLanguage.ChineseSimplified,
        languageCode: 'zh',
        url: `https://www.arcgis.com/sharing/rest/content/items/1c62ff85a58e4106a7e6c28d08449384/resources/styles/root.json`,
    },
    {
        id: 'cb63ee19b65f480e8e222334e300aa2f',
        title: 'Hybrid Reference Layer (Chinese (Taiwan))',
        language: ReferenceLayerLanguage.ChineseTaiwan,
        languageCode: 'zh-TW',
        url: `https://www.arcgis.com/sharing/rest/content/items/cb63ee19b65f480e8e222334e300aa2f/resources/styles/root.json`,
    },
    {
        id: '1f7d2416ab774ad59bdff397a79c8977',
        title: 'Hybrid Reference Layer (Chinese (Hong Kong))',
        language: ReferenceLayerLanguage.ChineseHongKong,
        languageCode: 'zh-HK',
        url: `https://www.arcgis.com/sharing/rest/content/items/1f7d2416ab774ad59bdff397a79c8977/resources/styles/root.json`,
    },
    {
        id: '09ae11c4d22640bd8fcce6933cb045bf',
        title: 'Hybrid Reference Layer (Czech)',
        language: ReferenceLayerLanguage.Czech,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/09ae11c4d22640bd8fcce6933cb045bf/resources/styles/root.json`,
    },
    {
        id: 'b70bd61693f848ea8fa6f357fecd6803',
        title: 'Hybrid Reference Layer (Danish)',
        language: ReferenceLayerLanguage.Danish,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/b70bd61693f848ea8fa6f357fecd6803/resources/styles/root.json`,
    },
    {
        id: '2796ddb8a3954235890caec704ff8d68',
        title: 'Hybrid Reference Layer (Dutch)',
        language: ReferenceLayerLanguage.Dutch,
        languageCode: 'nl',
        url: `https://www.arcgis.com/sharing/rest/content/items/2796ddb8a3954235890caec704ff8d68/resources/styles/root.json`,
    },
    {
        id: 'aca754de522b48c1a76924156bb8ea0e',
        title: 'Hybrid Reference Layer (Estonian)',
        language: ReferenceLayerLanguage.Estonian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/aca754de522b48c1a76924156bb8ea0e/resources/styles/root.json`,
    },
    {
        id: '787fe34427ea40d9aa7e7a09fe67dccf',
        title: 'Hybrid Reference Layer (Finnish)',
        language: ReferenceLayerLanguage.Finnish,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/787fe34427ea40d9aa7e7a09fe67dccf/resources/styles/root.json`,
    },
    {
        id: '46add16143e546c9900043bcc38d52cf',
        title: 'Hybrid Reference Layer (French)',
        language: ReferenceLayerLanguage.French,
        languageCode: 'fr',
        url: `https://www.arcgis.com/sharing/rest/content/items/46add16143e546c9900043bcc38d52cf/resources/styles/root.json`,
    },
    {
        id: 'da44d3524641418b936b74b48f0e3060',
        title: 'Hybrid Reference Layer (German)',
        language: ReferenceLayerLanguage.German,
        languageCode: 'de',
        url: `https://www.arcgis.com/sharing/rest/content/items/da44d3524641418b936b74b48f0e3060/resources/styles/root.json`,
    },
    {
        id: '2d403b50a1c2476983532ccda7f66147',
        title: 'Hybrid Reference Layer (Greek)',
        language: ReferenceLayerLanguage.Greek,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/2d403b50a1c2476983532ccda7f66147/resources/styles/root.json`,
    },
    {
        id: '7d712aae1595417780574a085817553e',
        title: 'Hybrid Reference Layer (Hungarian)',
        language: ReferenceLayerLanguage.Hungarian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/7d712aae1595417780574a085817553e/resources/styles/root.json`,
    },
    {
        id: 'c320a00d40c94f488391b90ab9661fc3',
        title: 'Hybrid Reference Layer (Indonesian)',
        language: ReferenceLayerLanguage.Indonesian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/c320a00d40c94f488391b90ab9661fc3/resources/styles/root.json`,
    },
    {
        id: '60a01f636e4c43a8bd85d71a312e0b92',
        title: 'Hybrid Reference Layer (Italian)',
        language: ReferenceLayerLanguage.Italian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/60a01f636e4c43a8bd85d71a312e0b92/resources/styles/root.json`,
    },
    {
        id: 'df372ac23dcd4bcb98d42151e455614d',
        title: 'Hybrid Reference Layer (Japanese)',
        language: ReferenceLayerLanguage.Japanese,
        languageCode: 'ja',
        url: `https://www.arcgis.com/sharing/rest/content/items/df372ac23dcd4bcb98d42151e455614d/resources/styles/root.json`,
    },
    {
        id: 'a12e7c3c0b7c4cedb401bff7de7eac8e',
        title: 'Hybrid Reference Layer (Korean)',
        language: ReferenceLayerLanguage.Korean,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/a12e7c3c0b7c4cedb401bff7de7eac8e/resources/styles/root.json`,
    },
    {
        id: '3169a3d8456e4c7d8d1f994ec81ffaea',
        title: 'Hybrid Reference Layer (Latvian)',
        language: ReferenceLayerLanguage.Latvian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/3169a3d8456e4c7d8d1f994ec81ffaea/resources/styles/root.json`,
    },
    {
        id: '689096fa8c9e4c3e97941404dc24542a',
        title: 'Hybrid Reference Layer (Lithuanian)',
        language: ReferenceLayerLanguage.Lithuanian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/689096fa8c9e4c3e97941404dc24542a/resources/styles/root.json`,
    },
    {
        id: '95a59231a08c40ae97b76ea3255e27ed',
        title: 'Hybrid Reference Layer (Norwegian)',
        language: ReferenceLayerLanguage.Norwegian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/95a59231a08c40ae97b76ea3255e27ed/resources/styles/root.json`,
    },
    {
        id: 'e0584171f8374a9bbde093111ff9415e',
        title: 'Hybrid Reference Layer (Polish)',
        language: ReferenceLayerLanguage.Polish,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/e0584171f8374a9bbde093111ff9415e/resources/styles/root.json`,
    },
    {
        id: '89b035a9cb1f4ed8bf638385ab8cebd7',
        title: 'Hybrid Reference Layer (Portuguese (Brazil))',
        language: ReferenceLayerLanguage.PortugueseBrazil,
        languageCode: 'pt-BR',
        url: `https://www.arcgis.com/sharing/rest/content/items/89b035a9cb1f4ed8bf638385ab8cebd7/resources/styles/root.json`,
    },
    {
        id: 'a4e8484fb8364273a646d7047a8ee152',
        title: 'Hybrid Reference Layer (Portuguese (Portugal))',
        language: ReferenceLayerLanguage.PortuguesePortugal,
        languageCode: 'pt-PT',
        url: `https://www.arcgis.com/sharing/rest/content/items/a4e8484fb8364273a646d7047a8ee152/resources/styles/root.json`,
    },
    {
        id: 'a2367aff699d415181b9249995774a30',
        title: 'Hybrid Reference Layer (Romanian)',
        language: ReferenceLayerLanguage.Romanian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/a2367aff699d415181b9249995774a30/resources/styles/root.json`,
    },
    {
        id: '2cab1abec2b2480bbda4cf034b3880f6',
        title: 'Hybrid Reference Layer (Russian)',
        language: ReferenceLayerLanguage.Russian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/2cab1abec2b2480bbda4cf034b3880f6/resources/styles/root.json`,
    },
    {
        id: '998ad7571b144d518d30f060a1fec1be',
        title: 'Hybrid Reference Layer (Serbian)',
        language: ReferenceLayerLanguage.Serbian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/998ad7571b144d518d30f060a1fec1be/resources/styles/root.json`,
    },
    {
        id: '52e9147467194fd6bf8b43ae88bcc28c',
        title: 'Hybrid Reference Layer (Slovak)',
        language: ReferenceLayerLanguage.Slovak,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/52e9147467194fd6bf8b43ae88bcc28c/resources/styles/root.json`,
    },
    {
        id: '7cdc1b7b3a914c69be68e1029b5ca627',
        title: 'Hybrid Reference Layer (Slovenian)',
        language: ReferenceLayerLanguage.Slovenian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/7cdc1b7b3a914c69be68e1029b5ca627/resources/styles/root.json`,
    },
    {
        id: 'dcbdf604698e43b7b4766fb305449ff2',
        title: 'Hybrid Reference Layer (Spanish)',
        language: ReferenceLayerLanguage.Spanish,
        languageCode: 'es',
        url: `https://www.arcgis.com/sharing/rest/content/items/dcbdf604698e43b7b4766fb305449ff2/resources/styles/root.json`,
    },
    {
        id: '8ea15c1b0cee4474a878d8fa24543244',
        title: 'Hybrid Reference Layer (Swedish)',
        language: ReferenceLayerLanguage.Swedish,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/8ea15c1b0cee4474a878d8fa24543244/resources/styles/root.json`,
    },
    {
        id: 'c5a9118ec6fa4b028b7afabe0de3ef17',
        title: 'Hybrid Reference Layer (Thai)',
        language: ReferenceLayerLanguage.Thai,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/c5a9118ec6fa4b028b7afabe0de3ef17/resources/styles/root.json`,
    },
    {
        id: 'b1c684ea7a45480b9e0e520eac8bfb47',
        title: 'Hybrid Reference Layer (Turkish)',
        language: ReferenceLayerLanguage.Turkish,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/b1c684ea7a45480b9e0e520eac8bfb47/resources/styles/root.json`,
    },
    {
        id: '8d21248f7f9b44c0bd9e142e79e39af3',
        title: 'Hybrid Reference Layer (Ukrainian)',
        language: ReferenceLayerLanguage.Ukrainian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/8d21248f7f9b44c0bd9e142e79e39af3/resources/styles/root.json`,
    },
    {
        id: '132985ac5794406983b88984a47d5a04',
        title: 'Hybrid Reference Layer (Vietnamese)',
        language: ReferenceLayerLanguage.Vietnamese,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/132985ac5794406983b88984a47d5a04/resources/styles/root.json`,
    },
    {
        id: 'b1735cb0d814497faf525daaabfbe94b',
        title: 'Hybrid Reference Layer (Hebrew)',
        language: ReferenceLayerLanguage.Hebrew,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/b1735cb0d814497faf525daaabfbe94b/resources/styles/root.json`,
    },
    {
        id: 'f9616aa008b84402ab30c207298b4f11',
        title: 'Hybrid Reference Layer (Bulgarian)',
        language: ReferenceLayerLanguage.Bulgarian,
        languageCode: 'unknown',
        url: `https://www.arcgis.com/sharing/rest/content/items/f9616aa008b84402ab30c207298b4f11/resources/styles/root.json`,
    },
];

/**
 * The center and zoom level for the full extent of the app, which is the default view when user clicks on zoom to full extent button.
 */
export const APP_FULL_EXTENT_CENTER = [-4.8908, 25.35031] as [number, number];

export const APP_FULL_EXTENT_ZOOM = 3;
