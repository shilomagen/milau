import express from "express";
import { webhookService } from "./services/webhook-service";
import mondayRoutes from "./monday/routes/monday-routes";

/**
 * Express server setup
 */
export class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // Parse JSON request bodies
    this.app.use(express.json());
    // Parse URL-encoded request bodies
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Configure API routes
   */
  private configureRoutes(): void {
    // Webhook endpoint
    this.app.post("/webhook", webhookService.handleWebhook);

    // Monday.com API routes
    this.app.use("/api/monday", mondayRoutes);

    // Health check endpoint
    this.app.get("/health", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export const server = new Server();
