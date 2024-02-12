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

const convertDateFromWaybackItemTitle = (dateString = '') => {
    const dateParts = dateString.split('-');
    const year = +dateParts[0];
    const mon = +dateParts[1] - 1;
    const day = +dateParts[2];
    return new Date(year, mon, day);
};

// the title of wayback item is like "World Imagery (Wayback 2014-02-20)",
// therefore need to call this method to extract "2014-02-20" from string
const extractDateFromWaybackItemTitle = (waybackItemTitle = '') => {
    const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
    const results = waybackItemTitle.match(regexpYYYYMMDD);

    const dateString = results.length ? results[0] : waybackItemTitle;
    const datetime = convertDateFromWaybackItemTitle(dateString);

    return {
        releaseDateLabel: dateString,
        releaseDatetime: datetime.getTime(),
    };
};

export { extractDateFromWaybackItemTitle };
