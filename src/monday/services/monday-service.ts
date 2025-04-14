import { GetBoardQuery, GetItemQuery, GetUserQuery } from "../../generated/graphql";
import { mondayClient } from "./monday-client";


/**
 * MondayService for handling business logic related to Monday.com
 */
export class MondayService {
  /**
   * Get board data by ID
   * @param boardId The board ID
   * @returns Promise with board data
   */
  public async getBoard(boardId: number): Promise<GetBoardQuery> {
    return mondayClient.getBoard(boardId);
  }

  /**
   * Get user data by ID
   * @param userId The user ID
   * @returns Promise with user data
   */
  public async getUser(userId: number): Promise<GetUserQuery> {
    return mondayClient.getUser(userId);
  }

  /**
   * Get item data by ID
   * @param itemId The item ID
   * @returns Promise with item data
   */
  public async getItem(itemId: number): Promise<GetItemQuery> {
    return mondayClient.getItem(itemId);
  }

  /**
   * Process a person column update event
   * @param personId The person ID that was updated
   * @param itemId The item ID where the update occurred
   * @returns Promise with processed result
   */
  public async processPersonUpdate(personId: number, itemId: number) {
    try {
      // Get user information
      const userData = await this.getUser(personId);
      console.log(`Processing person update for user:`, userData);

      // Get the item information
      const itemData = await this.getItem(itemId);
      console.log(`Item being updated:`, itemData);

      // Your business logic here
      // For example, update another column based on the person assignment

      return {
        success: true,
        user: userData,
        item: itemData,
        message: `Successfully processed person update for ID: ${personId} on item: ${itemId}`,
      };
    } catch (error) {
      console.error("Error processing person update:", error);
      throw error;
    }
  }

  /**
   * Update an item's column value
   * @param itemId The item ID to update
   * @param boardId The board ID containing the item
   * @param columnId The column ID to update
   * @param value The new value
   * @returns Promise with update result
   */
  public async updateColumnValue(
    itemId: number,
    boardId: number,
    columnId: string,
    value: any
  ) {
    return mondayClient.updateColumnValue(itemId, boardId, columnId, value);
  }

  /**
   * Set the status of a task
   * @param itemId The item ID to update
   * @param boardId The board ID containing the item
   * @param statusLabel The status label to set
   * @returns Promise with update result
   */
  public async setTaskStatus(
    itemId: number,
    boardId: number,
    statusLabel: string
  ) {
    return mondayClient.setTaskStatus(itemId, boardId, statusLabel);
  }

  /**
   * Post an update to a specific task
   * @param itemId The item ID to post the update to
   * @param updateText The update text content
   * @returns Promise with created update data
   */
  public async createUpdate(itemId: number, updateText: string) {
    return mondayClient.createUpdate(itemId, updateText);
  }

  /**
   * Run a custom GraphQL query
   * @param query The GraphQL query string
   * @param variables Query variables
   * @returns Promise with query results
   */
  public async runQuery<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return mondayClient.query<T>(query, variables);
  }

  /**
   * Run a custom GraphQL mutation
   * @param mutation The GraphQL mutation string
   * @param variables Mutation variables
   * @returns Promise with mutation results
   */
  public async runMutation<T = any>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return mondayClient.mutate<T>(mutation, variables);
  }

  /**
   * Create a new item in a board
   * @param boardId The board ID where to create the item
   * @param itemName The name of the new item
   * @param columnValues Optional column values to set during item creation
   * @returns Promise with the created item data including id and name
   */
  public async createItem(
    boardId: number,
    itemName: string,
    columnValues: Record<string, any>
  ) {
    return mondayClient.createItem(boardId, itemName, columnValues);
  }
}

// Export a singleton instance
export const mondayService = new MondayService();
