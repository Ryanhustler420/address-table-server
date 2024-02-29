import { Roles, DUMMY_USER_ATTRS, newObjectIdAsString } from "@com.xcodeclazz/monolithic-common";
import { UserRoleChangedConsumer } from "../user-role-changed-consumer";
import { CompilersUserRoleChangedEvent } from "@com.xcodeclazz/mq";
import { rabbitMqWrapper } from "../../../../rabbitmq-wrapper";
import { User } from "../../../../../models/key/user";

const wait = async () => Promise.resolve();

it("non existing user", async () => {
  const consumer = new UserRoleChangedConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const data: CompilersUserRoleChangedEvent["payload"] = {
    user: newObjectIdAsString(),
    blame: newObjectIdAsString(),
    roles: [Roles.ADMIN, Roles.NORMAL],
  };

  await wait();
  await consumer.onParsedData("Placeholder", data, message);
});

it("existing user roles updated", async () => {
  const consumer = new UserRoleChangedConsumer(rabbitMqWrapper.conn);
  consumer.work_queue();

  const u1 = await User.build(
    DUMMY_USER_ATTRS("email@gmail.com", "2334343")
  ).save();

  // @ts-ignore
  const message: amqp.ConsumeMessage = {};

  const data: CompilersUserRoleChangedEvent["payload"] = {
    user: u1.id,
    blame: u1.id,
    roles: [Roles.ADMIN, Roles.NORMAL],
  };

  await wait();
  await consumer.onParsedData("Placeholder", data, message);

  const ex = await User.findById(data.user);
  expect(ex?.roles?.length).toEqual(2);
  expect(ex?.roles).toContain(69);
  expect(ex?.roles).toContain(0);
  expect(ex?.id).toEqual(data.user);
});
