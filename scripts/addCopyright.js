const fs = require('fs');
const path = require('path');

// Define your copyright statement
const copyrightStatement = `/* Copyright 2024 Esri
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
 */`;

// Function to add copyright to JavaScript and TypeScript files
function addCopyright(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Error retrieving file stats:", err);
                    return;
                }

                if (stats.isDirectory()) {
                    addCopyright(filePath);
                } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error("Error reading file:", err);
                            return;
                        }

                        if (!data.startsWith(copyrightStatement)) {
                            fs.writeFile(filePath, `${copyrightStatement}\n\n${data}`, {
                                encoding: 'utf8',
                                flag: 'w'
                            }, err => {
                                if (err) {
                                    console.error("Error writing to file:", err);
                                } else {
                                    console.log(`Copyright added to ${filePath}`);
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}

// Replace 'your_directory_path' with the path to your repository
const directoryPath = path.join(__dirname, '../src');
addCopyright(directoryPath);