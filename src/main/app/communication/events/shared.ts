import { ChannelEvent } from "../shared/communication";

export type SharedExampleChannel = "shared-example";

export type SharedEventPayloadMap = {
  "shared-example": {
    sharedId: string;
  };
  "shared-example-reply": {
    replyId: string;
  };
};

export type SharedExampleEvent = ChannelEvent<
  SharedExampleChannel,
  SharedEventPayloadMap,
  "shared-example"
>;

export type SharedExampleReplyEvent = ChannelEvent<
  SharedExampleChannel,
  SharedEventPayloadMap,
  "shared-example-reply"
>;

export type SharedExampleEvents = SharedExampleEvent | SharedExampleReplyEvent;
