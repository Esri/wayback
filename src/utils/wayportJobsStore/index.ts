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

import { DownloadJob } from '@store/DownloadMode/reducer';

/**
 * Maximum number of download job entries allowed in IndexedDB
 */
const MAX_ENTRIES = 5;

/**
 * A utility class for managing DownloadJob entries in the browser's IndexedDB storage.
 *
 * `WayportJobsStore` provides methods to persistently store, retrieve, update, and manage
 * download job entries in an IndexedDB object store. It enforces a maximum limit of entries,
 * preventing new inserts when the limit is reached.
 *
 * ### Features
 * - Initializes and manages an IndexedDB database and object store for download jobs.
 * - Stores download job entries with automatic persistence.
 * - Maintains a strict maximum of 5 entries - no new inserts allowed when limit is reached.
 * - Supports querying jobs by user ID.
 * - Provides add, update, delete, and query operations.
 *
 * ### Usage
 * ```typescript
 * const store = new WayportJobsStore();
 * await store.init();
 *
 * // Add a job
 * const canAdd = await store.canAddNewEntry('user123');
 * if (canAdd) {
 *   await store.addJob(downloadJob);
 * }
 *
 * // Get jobs by user ID
 * const userJobs = await store.getJobsByUserId('user123');
 *
 * // Update a job
 * await store.updateJob(updatedJob);
 *
 * // Delete a job
 * await store.deleteJob('job-id');
 *
 * // Get all jobs
 * const allJobs = await store.getAllJobs();
 * ```
 *
 * @class
 * @public
 */
class WayportJobsStore {
    private dbName = 'WaybackAppDownloadJobs';
    private storeName = 'downloadJobs';
    private db: IDBDatabase | null = null;

    /**
     * Initialize the IndexedDB database and object store.
     * This must be called before any other operations.
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                    });

                    // Create index for userId to support querying by user
                    objectStore.createIndex('userId', 'userId', {
                        unique: false,
                    });

                    // Create index for startTime to support sorting by creation time
                    objectStore.createIndex('startTime', 'startTime', {
                        unique: false,
                    });
                }
            };
        });
    }

    /**
     * Get the current count of download jobs in the store.
     * If userId is provided, counts only jobs for that user.
     *
     * @param userId - Optional user ID to filter counts by user
     */
    private async getCount(userId?: string): Promise<number> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readonly'
            );
            const objectStore = transaction.objectStore(this.storeName);

            if (userId) {
                // Count only entries for this user
                const index = objectStore.index('userId');
                const request = index.count(userId);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            } else {
                // Count all entries
                const request = objectStore.count();

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            }
        });
    }

    /**
     * Check if a new entry can be added to the store for a specific user.
     * Returns false if the maximum number of entries (5) has been reached for that user.
     *
     * @param userId - The user ID to check the limit for
     */
    async canAddNewEntry(userId: string): Promise<boolean> {
        const count = await this.getCount(userId);
        return count < MAX_ENTRIES;
    }

    /**
     * Get the maximum number of entries allowed in the store.
     */
    getMaxEntries(): number {
        return MAX_ENTRIES;
    }

    /**
     * Add a new download job to the store.
     * Throws an error if the maximum number of entries has been reached for this user.
     *
     * @param job - The download job to add
     * @throws {Error} If the maximum number of entries (5) has been reached for this user
     */
    async addJob(job: DownloadJob): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        const canAdd = await this.canAddNewEntry(job.userId);
        if (!canAdd) {
            throw new Error(
                `Cannot add new download job. Maximum of ${MAX_ENTRIES} entries reached for this user. Please delete an existing job first.`
            );
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(job);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Update an existing download job in the store.
     * If the job doesn't exist, it will be added (subject to max entries limit).
     *
     * @param job - The download job to update
     */
    async updateJob(job: DownloadJob): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(job);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Delete a download job from the store by its ID.
     *
     * @param jobId - The ID of the job to delete
     */
    async deleteJob(jobId: string): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(jobId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Get a single download job by its ID.
     *
     * @param jobId - The ID of the job to retrieve
     * @returns The download job, or undefined if not found
     */
    async getJob(jobId: string): Promise<DownloadJob | undefined> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readonly'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(jobId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    /**
     * Get all download jobs for a specific user.
     *
     * @param userId - The ID of the user whose jobs to retrieve
     * @returns An array of download jobs belonging to the specified user
     */
    async getJobsByUserId(userId: string): Promise<DownloadJob[]> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readonly'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('userId');
            const request = index.getAll(userId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }
}

// Create a singleton instance
export const wayportJobsStore = new WayportJobsStore();
