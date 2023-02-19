import { findDocuments } from "./findDocuments.js";
import { safeString } from "../services/security.js";
import crypto from 'crypto';
import fileStore from "../services/filestore.js";

export const deleteDocument = async (database, collection, filter) => {
    database = safeString(database);
    collection = safeString(collection);
    const toDelete = await findDocuments(database, collection, filter);
    if(toDelete.length > 0) {
        const object = toDelete[0];
        const filePathtoHash = collection + JSON.stringify(object);
        const filePathBuffer = await crypto.subtle.digest("SHA-256", Buffer.from(filePathtoHash));
        const filePath = Buffer.from(filePathBuffer).toString('base64url');
        fileStore.deleteFile("/" + database + "/" + collection + "/" + filePath);
    }
}