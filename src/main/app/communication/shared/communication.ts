export type ChannelEvent<
  ChannelName extends string,
  Map extends Record<string, unknown> = Record<string, unknown>,
  Event extends keyof Map = keyof Map
> = {
  channel: ChannelName;
  event: Event;
  payload?: Map[Event];
};

export type Channel<T extends ChannelEvent<string, Record<string, unknown>, string>> = T["channel"];
export type Event<T extends ChannelEvent<string, Record<string, unknown>, string>> = T["event"];
export type EventPayload<T extends ChannelEvent<string>> = T["payload"];
