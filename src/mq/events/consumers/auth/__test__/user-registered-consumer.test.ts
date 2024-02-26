import { newObjectId, DUMMY_USER_ATTRS } from "@com.xcodeclazz/monolithic-common";
import { UserRegisteredConsumer } from "../user-registered-consumer";
import { CompilersUserRegisteredEvent } from "@com.xcodeclazz/mq";
import { rabbitMqWrapper } from "../../../../rabbitmq-wrapper";
import { User } from "../../../../../models/key/user";
import * as amqp from "amqplib/callback_api";

const wait = async () => Promise.resolve();

it("user already found", async () => {
  const consumer = new UserRegisteredConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const u1 = await User.build(
    DUMMY_USER_ATTRS("email@fmail.com", "123456")
  ).save();

  const data: CompilersUserRegisteredEvent["payload"] = {
    user: u1.id,
    ...DUMMY_USER_ATTRS("email@fmail.com", "123456"),
  };

  await wait();
  await consumer.onParsedData("Placeholder", data, message);

  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(1);
  expect((await rabbitMqWrapper.conn.createChannel()).consume).toHaveBeenCalledTimes(1);

  const users = await User.find({ _id: u1.id });
  expect(users.length).toEqual(1);
});

it("user not found", async () => {
  const consumer = new UserRegisteredConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const uid = newObjectId();

  const data: CompilersUserRegisteredEvent["payload"] = {
    user: uid,
    ...DUMMY_USER_ATTRS("email@fmail.com", "123456"),
  };

  await wait();
  await consumer.onParsedData("Placeholder", data, message);

  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(1);
  expect((await rabbitMqWrapper.conn.createChannel()).consume).toHaveBeenCalledTimes(1);

  const user = await User.findOne({ email: "email@fmail.com" });
  expect(user?.id).toEqual(uid.toString());
});
