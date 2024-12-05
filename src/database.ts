import { Message } from "ai/react";

const DB_NAME = "Conversation-cache";
const STORE_NAME = "chat";
const DB_VERSION = 1;

const isBrowser =
  typeof Window !== "undefined" && typeof window !== "undefined";

class Database {
  private db: IDBDatabase | null = null;

  constructor() {
    if (isBrowser) {
      this.initDB(); // Initialize the database when the class is instantiated
    }
  }

  // Initialize the DB once and store the reference in the db property
  private initDB(): void {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      this.db = request.result; // Store the database reference in the db property
    };

    request.onerror = (event) => {
      console.error("Database error: ", (event.target as IDBRequest).error);
    };
  }

  // Add a message to the store
  public async addMessage(message: Message): Promise<void> {
    if (!this.db) throw new Error("Database not initialized yet.");

    const transaction = this.db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(message); // Add or update message by key (id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  public async addMessages(messages: Message[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized yet.");

    const transaction = this.db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      for (const message of messages) {
        store.put(message); // Add or update each message
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) =>
        reject((event.target as IDBRequest).error);
    });
  }

  // Get all messages from the store
  public async getMessages(): Promise<Message[]> {
    if (!this.db) throw new Error("Database not initialized yet.");

    const transaction = this.db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll(); // Get all records

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  public async getMessageById(id: string): Promise<Message> {
    if (!this.db) throw new Error("Databse no initialized yet");

    const transaction = this.db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id); // Get all records

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  // Clear all messages from the store
  public async clearMessages(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized yet.");

    const transaction = this.db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear(); // Clear the entire store

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  public async deleteMessagesByIds(ids: string[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized yet.");

    const transaction = this.db.transaction("messages", "readwrite");
    const store = transaction.objectStore("messages");

    return new Promise((resolve, reject) => {
      for (const id of ids) {
        store.delete(id); // Delete each message by ID
      }

      transaction.oncomplete = () => resolve(); // Resolve when the transaction is complete
      transaction.onerror = (event) =>
        reject((event.target as IDBRequest).error); // Reject on error
    });
  }
}
const dbInstance = new Database();
export default dbInstance;
