import { Request, Response } from "express";
import { mondayService } from "../monday/services/monday-service";

/**
 * Webhook service to handle incoming webhook events
 */
export class WebhookService {
  /**
   * Handle webhook POST requests
   * @param req Express request
   * @param res Express response
   */
  public handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const event = req.body as any;

    console.log("Event:", event);
    // Check if this is a challenge request from Monday.com
    if (event && event.challenge) {
      // Return the challenge token to verify the webhook URL
      res.status(200).json({ challenge: event.challenge });
      return;
    }

    const { event: eventData } = req.body;

    if (
      eventData.columnTitle === "Person" &&
      eventData.value?.personsAndTeams?.length > 0
    ) {
      console.log("Person column updated, processing...");
      const personId = eventData.value.personsAndTeams[0].id;
      const itemId = eventData.pulseId; // Monday.com item ID
      const boardId = eventData.boardId;

      try {
        if (personId === 63989301) {
          await mondayService.setTaskStatus(itemId, boardId, "Stuck");

          const item = await mondayService.getItem(itemId);
          console.log("Item:", item);
        } else {
          console.log("Other person ID, skipping...");
        }
      } catch (error) {
        console.error("Error processing task status update:", error);
      }
    } else {
      console.log("Other column updated, skipping...");
    }

    // Acknowledge receipt of the webhook
    res.status(200).json({
      status: "success",
      message: "Webhook received and processed",
    });
  };
}

export const webhookService = new WebhookService();
