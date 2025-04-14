import express, { Request, Response } from "express";
import { mondayService } from "../services/monday-service";

const router = express.Router();

// Get board by ID
router.get(
  "/boards/:boardId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const boardId = parseInt(req.params["boardId"]!, 10);
      if (isNaN(boardId)) {
        return res.status(400).json({ error: "Invalid board ID" });
      }

      const board = await mondayService.getBoard(boardId);
      return res.json({ board });
    } catch (error: any) {
      console.error("Error fetching board:", error);
      return res.status(500).json({
        error: "Failed to fetch board",
        message: error.message,
      });
    }
  }
);

// Get user by ID
router.get(
  "/users/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = parseInt(req.params["userId"]!, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await mondayService.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ user });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return res.status(500).json({
        error: "Failed to fetch user",
        message: error.message,
      });
    }
  }
);

// Get item by ID
router.get(
  "/items/:itemId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const itemId = parseInt(req.params["itemId"]!, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const item = await mondayService.getItem(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      return res.json({ item });
    } catch (error: any) {
      console.error("Error fetching item:", error);
      return res.status(500).json({
        error: "Failed to fetch item",
        message: error.message,
      });
    }
  }
);

// Create a new item
router.post(
  "/boards/:boardId/items",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const boardId = parseInt(req.params["boardId"]!, 10);
      if (isNaN(boardId)) {
        return res.status(400).json({ error: "Invalid board ID" });
      }

      const { name, columnValues } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Item name is required" });
      }

      const newItem = await mondayService.createItem(
        boardId,
        name,
        columnValues
      );
      return res.status(201).json({ item: newItem });
    } catch (error: any) {
      console.error("Error creating item:", error);
      return res.status(500).json({
        error: "Failed to create item",
        message: error.message,
      });
    }
  }
);

// Update column value
router.patch(
  "/boards/:boardId/items/:itemId/columns/:columnId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const boardId = parseInt(req.params["boardId"]!, 10);
      const itemId = parseInt(req.params["itemId"]!, 10);
      const columnId = req.params["columnId"] || "";

      if (isNaN(boardId) || isNaN(itemId)) {
        return res.status(400).json({ error: "Invalid board ID or item ID" });
      }

      const { value } = req.body;
      if (value === undefined) {
        return res.status(400).json({ error: "Value is required" });
      }

      const result = await mondayService.updateColumnValue(
        itemId,
        boardId,
        columnId,
        value
      );
      return res.json({ result });
    } catch (error: any) {
      console.error("Error updating column value:", error);
      return res.status(500).json({
        error: "Failed to update column value",
        message: error.message,
      });
    }
  }
);

// Create an update on an item
router.post(
  "/items/:itemId/updates",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const itemId = parseInt(req.params["itemId"]!, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Update text is required" });
      }

      const update = await mondayService.createUpdate(itemId, text);
      return res.status(201).json({ update });
    } catch (error: any) {
      console.error("Error creating update:", error);
      return res.status(500).json({
        error: "Failed to create update",
        message: error.message,
      });
    }
  }
);

// Run a custom query
router.post("/query", async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, variables } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const result = await mondayService.runQuery(query, variables);
    return res.json(result);
  } catch (error: any) {
    console.error("Error running query:", error);
    return res.status(500).json({
      error: "Failed to run query",
      message: error.message,
    });
  }
});

// Run a custom mutation
router.post("/mutate", async (req: Request, res: Response): Promise<any> => {
  try {
    const { mutation, variables } = req.body;
    if (!mutation) {
      return res.status(400).json({ error: "Mutation is required" });
    }

    const result = await mondayService.runMutation(mutation, variables);
    return res.json(result);
  } catch (error: any) {
    console.error("Error running mutation:", error);
    return res.status(500).json({
      error: "Failed to run mutation",
      message: error.message,
    });
  }
});

export default router;
