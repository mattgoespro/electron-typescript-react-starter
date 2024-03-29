import { ChannelEvent } from "main/app/communication/shared/communication";

export type AppExampleChannel = "app-example";

export type AppExampleEventPayloadMap = {
  "app-example": {
    id: string;
  };
};

export type AppExampleEvent = ChannelEvent<
  AppExampleChannel,
  AppExampleEventPayloadMap,
  "app-example"
>;

export type AppExampleEvents = AppExampleEvent;
