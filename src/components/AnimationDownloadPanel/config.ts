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

export const VIDEO_SIZE_OPTIONS = [
    {
        title: 'horizontal',
        dimensions: [
            [1920, 1080], // aspect ratio 16:9
            [1080, 720], // aspect ratio 3:2
        ],
    },
    {
        title: 'square',
        dimensions: [
            [1080, 1080], // aspect ratio 1:1
            [720, 720], // aspect ratio 1:1
        ],
    },
    {
        title: 'vertical',
        dimensions: [
            [1080, 1920], // aspect ratio 9:16
            [720, 1080], // aspect ratio 2:3
        ],
    },
];
