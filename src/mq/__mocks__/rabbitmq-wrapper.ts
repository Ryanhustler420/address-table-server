import { ConsumeMessage, Message, Options } from "amqplib";

export const rabbitMqWrapper = {
  conn: {
    close: jest.fn().mockImplementation(() => {}),
    createChannel: jest.fn().mockReturnValue({
        assertQueue: jest.fn().mockImplementation((queue: string, options?: Options.AssertQueue) => {}),
        bindQueue: jest.fn().mockImplementation((queue: string, source: string, pattern: string, args?: any) => {}),
        assertExchange: jest.fn().mockImplementation((exchange: string, type: "direct" | "topic" | "headers" | "fanout" | "match" | string, options?: Options.AssertExchange) => {}),
        publish: jest.fn().mockImplementation((exchange: string, routingKey: string, content: Buffer, options?: Options.Publish) => {}),
        sendToQueue: jest.fn().mockImplementation((queue: string, content: Buffer, options?: Options.Publish) => {}),
        consume: jest.fn().mockImplementation((queue: string, onMessage: (msg: ConsumeMessage | null) => void, options?: Options.Consume) => {}),
        ack: jest.fn().mockImplementation((message: Message, allUpTo?: boolean) => {}),
    }),
  },
};
