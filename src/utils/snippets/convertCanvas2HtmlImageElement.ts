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

/**
 * Converts an HTMLCanvasElement to an HTMLImageElement.
 * @param canvas - The HTMLCanvasElement to be converted.
 * @returns A promise that resolves to an HTMLImageElement.
 */
export const convertCanvas2HtmlImageElement = async (
    canvas: HTMLCanvasElement
): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const img = new Image();

                img.onload = () => {
                    URL.revokeObjectURL(url);
                    resolve(img);
                };

                img.onerror = (error) => {
                    URL.revokeObjectURL(url);
                    reject(error);
                };

                img.src = url;
            } else {
                reject(new Error('Failed to convert canvas to blob'));
            }
        });
    });
};
