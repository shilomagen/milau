import { Request, Response } from "express";

/**
 * Webhook service to handle incoming webhook events
 */
export class WebhookService {
  constructor() {
    // Bind the method to ensure 'this' context is preserved
    this.handleWebhook = this.handleWebhook.bind(this);
  }

  /**
   * Handle webhook POST requests
   * @param req Express request
   * @param res Express response
   */
  public handleWebhook(req: Request, res: Response): void {
    const event = req.body;

    console.log("Webhook event received:");
    console.log(JSON.stringify(event, null, 2));

    // Acknowledge receipt of the webhook
    res.status(200).json({ status: "success", message: "Webhook received" });
  }
}

export const webhookService = new WebhookService();
