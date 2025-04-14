import { GraphQLClient } from "graphql-request";
import { MONDAY_API_TOKEN } from "../../config";
import {
  CreateItemMutation,
  CreateUpdateMutation,
  GetBoardQuery,
  GetItemQuery,
  getSdk,
  GetUserQuery,
} from "../../generated/graphql";

/**
 * MondayClient service for interacting with the Monday.com GraphQL API
 */
export class MondayClient {
  private client: GraphQLClient;
  private apiUrl = "https://api.monday.com/v2";
  private apiToken: string;

  constructor() {
    this.apiToken = MONDAY_API_TOKEN;

    if (!this.apiToken) {
      console.warn("MONDAY_API_TOKEN not found in environment variables");
    }

    this.client = new GraphQLClient(this.apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.apiToken,
      },
    });
  }

  /**
   * Send a query to the Monday.com GraphQL API
   * @param query GraphQL query string
   * @param variables Query variables
   * @returns Promise with query results
   */
  public async query<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      console.error("Error executing Monday.com GraphQL query:", error);
      throw error;
    }
  }

  /**
   * Send a mutation to the Monday.com GraphQL API
   * @param mutation GraphQL mutation string
   * @param variables Mutation variables
   * @returns Promise with mutation results
   */
  public async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      return await this.client.request<T>(mutation, variables);
    } catch (error) {
      console.error("Error executing Monday.com GraphQL mutation:", error);
      throw error;
    }
  }

  /**
   * Get a board by its ID
   * @param boardId The Monday.com board ID
   * @returns Promise with board data
   */
  public async getBoard(boardId: number): Promise<GetBoardQuery> {
    return getSdk(this.client).GetBoard({
      boardId: String(boardId),
    });
  }

  /**
   * Get a user by ID
   * @param userId The Monday.com user ID
   * @returns Promise with user data
   */
  public async getUser(userId: number): Promise<GetUserQuery> {
    return getSdk(this.client).GetUser({
      userId: String(userId),
    });
  }

  /**
   * Get an item by ID
   * @param itemId The Monday.com item ID
   * @returns Promise with item data
   */
  public async getItem(itemId: number): Promise<GetItemQuery> {
    return getSdk(this.client).GetItem({
      itemId: String(itemId),
    });
  }

  /**
   * Update an item's column value
   * @param itemId The item ID to update
   * @param boardId The board ID containing the item
   * @param columnId The column ID to update
   * @param value The new value
   * @returns Promise with updated item data
   */
  public async updateColumnValue(
    itemId: number,
    boardId: number,
    columnId: string,
    value: any
  ) {
    try {
      return getSdk(this.client).ChangeColumnValue({
        itemId: String(itemId),
        boardId: String(boardId),
        columnId,
        value: JSON.stringify(value) as any,
      });
    } catch (error) {
      console.error("Error updating column value:", error);
      throw error;
    }
  }

  /**
   * Set the status of a task (item)
   * @param itemId The item ID to update
   * @param boardId The board ID containing the item
   * @param statusLabel The status label to set
   * @returns Promise with updated item data
   */
  public async setTaskStatus(
    itemId: number,
    boardId: number,
    statusLabel: string
  ) {
    try {
      // First, get the status column ID from the board
      const boardData = await this.getBoard(boardId);
      const statusColumn = boardData.boards?.[0]?.columns?.find(
        (column) => column?.type === "status"
      );

      if (!statusColumn) {
        throw new Error("Status column not found on board");
      }

      // Prepare the value object for a status update
      const value = { label: statusLabel };

      return this.updateColumnValue(itemId, boardId, statusColumn.id, value);
    } catch (error) {
      console.error("Error setting task status:", error);
      throw error;
    }
  }

  /**
   * Create an update on an item
   * @param itemId The item ID to post the update to
   * @param updateText The update text content
   * @returns Promise with the created update data
   */
  public async createUpdate(
    itemId: number,
    updateText: string
  ): Promise<CreateUpdateMutation> {
    return getSdk(this.client).CreateUpdate({
      itemId: String(itemId),
      updateText,
    });
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
  ): Promise<CreateItemMutation> {
    return getSdk(this.client).CreateItem({
      boardId: String(boardId),
      itemName,
      columnValues: columnValues!,
    });
  }
}

// Export a singleton instance
export const mondayClient = new MondayClient();
