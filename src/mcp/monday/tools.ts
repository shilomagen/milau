import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import { MONDAY_API_TOKEN } from "../../config";
import {
  CreateItemMutation,
  CreateUpdateMutation,
  GetBoardQuery,
  GetItemQuery,
  getSdk,
  GetUserQuery,
} from "./generated/graphql";

/**
 * The client for interacting with the Monday.com GraphQL API
 */
class MondayClient {
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
   * Get a board by its ID
   */
  public async getBoard(boardId: number): Promise<GetBoardQuery> {
    return getSdk(this.client).GetBoard({
      boardId: String(boardId),
    });
  }

  /**
   * Get a user by ID
   */
  public async getUser(userId: number): Promise<GetUserQuery> {
    return getSdk(this.client).GetUser({
      userId: String(userId),
    });
  }

  /**
   * Get an item by ID
   */
  public async getItem(itemId: number): Promise<GetItemQuery> {
    return getSdk(this.client).GetItem({
      itemId: String(itemId),
    });
  }

  /**
   * Update an item's column value
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
   */
  public async createItem(
    boardId: number,
    itemName: string,
    columnValues: Record<string, any>
  ): Promise<CreateItemMutation> {
    return getSdk(this.client).CreateItem({
      boardId: String(boardId),
      itemName,
      columnValues,
    });
  }
}

// Create a singleton instance
export const mondayClient = new MondayClient();

// Zod schema definitions
export const schemas = {
  getBoard: z.object({
    boardId: z
      .number()
      .describe("The unique numeric ID of the Monday.com board to retrieve"),
  }),

  getUser: z.object({
    userId: z
      .number()
      .describe("The unique numeric ID of the Monday.com user to retrieve"),
  }),

  getItem: z.object({
    itemId: z
      .number()
      .describe("The unique numeric ID of the Monday.com item to retrieve"),
  }),

  updateColumnValue: z.object({
    itemId: z.number().describe("The unique numeric ID of the item to update"),
    boardId: z
      .number()
      .describe("The unique numeric ID of the board containing the item"),
    columnId: z
      .string()
      .describe("The column ID to update (e.g., 'status', 'date', 'text')"),
    value: z
      .any()
      .describe(
        "The new value to set for the column (format depends on column type)"
      ),
  }),

  setTaskStatus: z.object({
    itemId: z
      .number()
      .describe("The unique numeric ID of the item/task to update"),
    boardId: z
      .number()
      .describe("The unique numeric ID of the board containing the item"),
    statusLabel: z
      .string()
      .describe(
        "The status label to set (e.g., 'Done', 'Working on it', 'Stuck')"
      ),
  }),

  createUpdate: z.object({
    itemId: z
      .number()
      .describe("The unique numeric ID of the item to add an update to"),
    updateText: z.string().describe("The text content of the update to add"),
  }),

  createItem: z.object({
    boardId: z
      .number()
      .describe("The unique numeric ID of the board where to create the item"),
    itemName: z.string().describe("The name of the new item to create"),
    columnValues: z
      .record(z.any())
      .describe("Key-value pairs of column values to set for the new item"),
  }),
};

// Tool implementations
export const tools = {
  getBoard: {
    name: "monday_get_board",
    description:
      "Retrieves detailed information about a specific Monday.com board including columns, items, and configuration",
    schema: schemas.getBoard,
    handler: async ({ boardId }: z.infer<typeof schemas.getBoard>) => {
      try {
        const result = await mondayClient.getBoard(boardId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in getBoard tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  getUser: {
    name: "monday_get_user",
    description:
      "Retrieves information about a specific Monday.com user including name, email, and profile details",
    schema: schemas.getUser,
    handler: async ({ userId }: z.infer<typeof schemas.getUser>) => {
      try {
        const result = await mondayClient.getUser(userId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in getUser tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  getItem: {
    name: "monday_get_item",
    description:
      "Retrieves detailed information about a specific Monday.com item including all column values",
    schema: schemas.getItem,
    handler: async ({ itemId }: z.infer<typeof schemas.getItem>) => {
      try {
        const result = await mondayClient.getItem(itemId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in getItem tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  updateColumnValue: {
    name: "monday_update_column_value",
    description:
      "Updates a specific column value of a Monday.com item. Use this to change status, dates, text, or any other column type.",
    schema: schemas.updateColumnValue,
    handler: async ({
      itemId,
      boardId,
      columnId,
      value,
    }: z.infer<typeof schemas.updateColumnValue>) => {
      try {
        const result = await mondayClient.updateColumnValue(
          itemId,
          boardId,
          columnId,
          value
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in updateColumnValue tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  setTaskStatus: {
    name: "monday_set_task_status",
    description:
      "Updates the status of a task/item in Monday.com. This is a simplified way to change the status column.",
    schema: schemas.setTaskStatus,
    handler: async ({
      itemId,
      boardId,
      statusLabel,
    }: z.infer<typeof schemas.setTaskStatus>) => {
      try {
        const result = await mondayClient.setTaskStatus(
          itemId,
          boardId,
          statusLabel
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in setTaskStatus tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  createUpdate: {
    name: "monday_create_update",
    description:
      "Creates a new update (comment) on a Monday.com item. Use this to add notes or comments to an item.",
    schema: schemas.createUpdate,
    handler: async ({
      itemId,
      updateText,
    }: z.infer<typeof schemas.createUpdate>) => {
      try {
        const result = await mondayClient.createUpdate(itemId, updateText);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in createUpdate tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },

  createItem: {
    name: "monday_create_item",
    description:
      "Creates a new item in a Monday.com board. Use this to add new tasks, projects, or other items to a board.",
    schema: schemas.createItem,
    handler: async ({
      boardId,
      itemName,
      columnValues,
    }: z.infer<typeof schemas.createItem>) => {
      try {
        const result = await mondayClient.createItem(
          boardId,
          itemName,
          columnValues
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error("Error in createItem tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  },
};
