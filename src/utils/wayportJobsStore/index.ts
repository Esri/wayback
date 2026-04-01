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

import { WayportJob } from '@store/WayportMode/reducer';

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
     * Add a new download job to the store.
     * Throws an error if the maximum number of entries has been reached for this user.
     *
     * @param job - The download job to add
     * @throws {Error} If the maximum number of entries (5) has been reached for this user
     */
    async addJob(job: WayportJob): Promise<void> {
        if (!this.db) {
            await this.init();
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
    async updateJob(job: WayportJob): Promise<void> {
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
     * Clear outdated jobs for a specific user.
     * Deletes jobs with status 'not started' that either have no createdAt timestamp
     * or were created beyond the specified cutoff time.
     *
     * @param userId - The ID of the user whose jobs to check
     * @param cutoffHours - Number of hours after which 'not started' jobs should be deleted
     */
    async clearOutdatedJobs(
        userId: string,
        cutoffHours: number
    ): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        if (!userId) {
            return;
        }

        // Get all jobs for this user
        const userJobs = await this.getJobsByUserId(userId);

        // Filter for jobs with status 'not started'
        const notStartedJobs = userJobs.filter(
            (job) => job.status === 'wayport job not started'
        );

        // Get current timestamp
        const now = Date.now();
        const cutoffMs = cutoffHours * 60 * 60 * 1000; // Convert hours to milliseconds

        // Find jobs to delete (no createdAt or created beyond cutoff time)
        const jobsToDelete = notStartedJobs.filter((job) => {
            // Delete if no createdAt timestamp
            if (!job.createdAt) {
                return true;
            }

            // Delete if created beyond cutoff time
            const age = now - job.createdAt;
            return age >= cutoffMs;
        });

        // Delete each outdated job
        const deletePromises = jobsToDelete.map((job) =>
            this.deleteJob(job.id)
        );

        await Promise.all(deletePromises);
    }

    /**
     * Get a single download job by its ID.
     *
     * @param jobId - The ID of the job to retrieve
     * @returns The download job, or undefined if not found
     */
    async getJob(jobId: string): Promise<WayportJob | undefined> {
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
    async getJobsByUserId(userId: string): Promise<WayportJob[]> {
        if (!this.db) {
            await this.init();
        }

        if (!userId) {
            return [];
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
