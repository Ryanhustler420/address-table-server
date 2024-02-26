import { Roles, toObjectId } from "@com.xcodeclazz/monolithic-common";
import { rabbitMqWrapper } from "../../../../rabbitmq-wrapper";
import { CompilersUserBannedEvent } from "@com.xcodeclazz/mq";
import { UserBannedConsumer } from "../user-banned-consumer";
import { createUser } from "../../../../../__mocks__/_";
import { User } from "../../../../../models/key/user";
import * as amqp from "amqplib/callback_api";

it("user not found", async () => {
  const consumer = new UserBannedConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const u1 = await createUser([Roles.NORMAL], false);
  const bogus = toObjectId("64ec67967012ba835ef454e3");

  const data: CompilersUserBannedEvent["payload"] = {
    user: bogus,
    reason: "user has logged in via another device without logout first",
  };

  await consumer.onParsedData("Placeholder", data, message);

  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(1);
  expect((await rabbitMqWrapper.conn.createChannel()).consume).toHaveBeenCalledTimes(1);

  const ex = await User.findById(u1.id);
  expect(ex?.is_banned).toEqual(false);
});

it("banned user if not already banned", async () => {
  const consumer = new UserBannedConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const u1 = await createUser([Roles.NORMAL], false);

  const data: CompilersUserBannedEvent["payload"] = {
    user: u1.id,
    reason: "user has logged in via another device without logout first",
  };

  await consumer.onParsedData("Placeholder", data, message);

  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(1);
  expect((await rabbitMqWrapper.conn.createChannel()).consume).toHaveBeenCalledTimes(1);

  const ex = await User.findById(u1.id);
  expect(ex?.is_banned).toEqual(true);
});

it("banned user even if already banned", async () => {
  const consumer = new UserBannedConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const u1 = await createUser([Roles.NORMAL], true);

  const data: CompilersUserBannedEvent["payload"] = {
    user: u1.id,
    reason: "user has logged in via another device without logout first",
  };

  await consumer.onParsedData("Placeholder", data, message);

  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(1);
  expect((await rabbitMqWrapper.conn.createChannel()).consume).toHaveBeenCalledTimes(1);

  const ex = await User.findById(u1.id);
  expect(ex?.is_banned).toEqual(true);
});
