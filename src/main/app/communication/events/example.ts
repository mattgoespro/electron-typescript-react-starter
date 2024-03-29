import { ChannelEvent } from "../shared/communication";

export type ExampleChannel = "example";

export type ExampleEventPayloadMap = {
  example: {
    id: string;
  };
  "example-reply": {
    replyId: string;
  };
};

export type ExampleEvent = ChannelEvent<ExampleChannel, ExampleEventPayloadMap, "example">;
export type ExampleReplyEvent = ChannelEvent<
  ExampleChannel,
  ExampleEventPayloadMap,
  "example-reply"
>;

export type ExampleEvents = ExampleEvent | ExampleReplyEvent;
