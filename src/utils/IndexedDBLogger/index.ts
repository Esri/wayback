interface LogEntry {
    id?: number;
    timestamp: number;
    eventName: string;
    payload: string;
}

/**
 * A utility class for logging events to the browser's IndexedDB storage.
 *
 * `IndexedDBLogger` provides methods to persistently store, retrieve, and manage log entries
 * in an IndexedDB object store. It is designed to keep a maximum number of log entries,
 * automatically removing the oldest entries when the limit is reached.
 *
 * ### Features
 * - Initializes and manages an IndexedDB database and object store for logs.
 * - Stores log entries with a timestamp, event name, and serialized payload.
 * - Maintains a maximum number of entries (`maxEntries`), removing the oldest as needed.
 * - Retrieves logs, optionally limited to a specified number of most recent entries.
 * - Clears all stored logs.
 *
 * ### Usage
 * ```typescript
 * const logger = new IndexedDBLogger();
 * await logger.log('eventName', { key: 'value' });
 * const logs = await logger.getLogs(10);
 * await logger.clearLogs();
 * ```
 *
 * @class
 * @public
 */
class IndexedDBLogger {
    private dbName = 'WaybackAppLogs';
    private storeName = 'logs';
    private maxEntries = 1000;
    private db: IDBDatabase | null = null;

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
                        autoIncrement: true,
                    });
                    objectStore.createIndex('timestamp', 'timestamp', {
                        unique: false,
                    });
                }
            };
        });
    }

    async log(eventName: string, payload: any): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        const entry: LogEntry = {
            timestamp: Date.now(),
            eventName,
            payload: JSON.stringify(payload),
        };

        // Check count and remove oldest if necessary
        const count = await this.getCount();

        if (count >= this.maxEntries) {
            await this.removeOldest();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(entry);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    private async getCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readonly'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.count();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    private async removeOldest(): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('timestamp');
            const request = index.openCursor();

            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    objectStore.delete(cursor.primaryKey);
                    resolve();
                } else {
                    resolve();
                }
            };
        });
    }

    async getLogs(limit?: number): Promise<LogEntry[]> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readonly'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const logs = request.result as LogEntry[];
                logs.sort((a, b) => b.timestamp - a.timestamp);
                resolve(limit ? logs.slice(0, limit) : logs);
            };
        });
    }

    async clearLogs(): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [this.storeName],
                'readwrite'
            );
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Downloads all logs as a JSON file for debugging and sharing with team members.
     *
     * @param filename - Optional filename for the downloaded file (defaults to 'wayback-logs-{timestamp}.json')
     * @param limit - Optional limit to the number of logs to download (defaults to all logs)
     */
    async downloadLogs(filename?: string, limit?: number): Promise<void> {
        const logs = await this.getLogs(limit);

        // Parse payload back to objects for better readability
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            // timestamp: log.timestamp,
            datetime: new Date(log.timestamp).toISOString(),
            eventName: log.eventName,
            payload: JSON.parse(log.payload),
        }));

        const exportData = {
            exportedAt: new Date().toISOString(),
            totalLogs: formattedLogs.length,
            logs: formattedLogs,
        };

        // Create blob and download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `wayback-logs-${Date.now()}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);
    }
}

export const logger = new IndexedDBLogger();

/**
 * Initializes the IndexedDBLogger instance.
 * This function should be called once during application startup.
 */
export const initLogger = async () => {
    try {
        await logger.init();

        (window as any).logger = logger; // Expose for debugging
        (window as any).downloadLogs = logger.downloadLogs.bind(logger); // Expose for easy log downloading
    } catch (error) {
        console.error('Failed to initialize logger:', error);
    }
};
