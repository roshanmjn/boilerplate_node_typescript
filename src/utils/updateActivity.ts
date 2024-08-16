import { ResultSetHeader } from "mysql2";
import { DB } from "../database/connection";
import Logger from "./Logger";

/**
 * Log user activity.
 *
 * @param {Object} data - An object containing information about the user activity.
 * @param {number} data.user_id - The user ID of the current user.
 * @param {string} data.message - Describes the change made in the table.
 * @param {string} data.table_changed - The name of the table that has been changed.
 * @param {string} data.operation - Specifies the operation: 'insert', 'update', or 'delete'.
 * @returns {boolean} - Returns true if the activity is successfully logged, false otherwise.
 * @description This function logs user activity based on the provided data object,
 * including the user ID, a message describing the change,
 * the name of the table that has been changed, and the type of operation (insert, update, or delete).
 * The function returns a boolean value indicating whether the activity is successfully logged.
 */
type UpdateActivityData = {
    user_id: number;
    message: string;
    table_changed: string;
    operation: string;
};
async function updateActivity(data: UpdateActivityData) {
    try {
        const { user_id, message, table_changed, operation } = data;
        let operation_id =
            {
                insert: 3,
                update: 2,
                delete: 1,
            }[operation] || false;

        if (!operation_id) return false;

        let icon =
            {
                insert: "plus",
                update: "edit",
                delete: "trash",
            }[operation] || "none";

        let query = `
        INSERT INTO user_activity (user_id, message, table_changed, operation_id,icon) 
        VALUES (?, ?, ?, ?, ?)`;
        const [insertToActivity] = await DB.query<ResultSetHeader>(query, [user_id, message, table_changed, operation_id, icon]);
        if (insertToActivity.affectedRows !== 1) {
            Logger.error("[S|UPDATE_ACTIVITY] Failed to log into user_activity table.");
            return false;
        } else {
            // Logger.info("[S|UPDATE_ACTIVITY] Logged activity into user_activity table.");
            return true;
        }
    } catch (err) {
        Logger.error("[S|UPDATE_ACTIVITY] Error: " + err);
        throw err;
    }
}

export { updateActivity };
