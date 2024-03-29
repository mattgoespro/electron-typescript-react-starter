import { IpcMainEvent } from "electron";
import { ExampleEvent, ExampleReplyEvent } from "./events/example";
import { SharedExampleEvent, SharedExampleReplyEvent } from "./events/shared";

export async function onExampleEvent(event: IpcMainEvent, eventType: ExampleEvent) {
  console.log("[main] Received example event.");
  console.log("[main] Payload: ");

  for (const key in eventType.payload) {
    console.log(`[main] ${key}: ${eventType.payload[key]}`);
  }
  event.reply<ExampleReplyEvent>("example", {
    event: "example-reply",
    payload: {
      replyId: `I am replying to event with id: ${eventType.payload.id}`
    }
  });
}

export async function onSharedExampleEvent(event: IpcMainEvent, eventType: SharedExampleEvent) {
  switch (eventType.event) {
    case "shared-example":
      console.log("[main] Received shared example event.");
      event.reply<SharedExampleReplyEvent>("shared-example", {
        event: "shared-example-reply",
        payload: { replyId: "Shared Example Event" }
      });
      return;
    default:
      return;
  }
}
