import * as amqp from "amqplib";
import {
  Subjects,
  ProducerBase,
  CodeUserRoleChangedEvent,
  LiveUserRoleChangedEvent,
  BatchUserRoleChangedEvent,
  NotesUserRoleChangedEvent,
  AdminUserRoleChangedEvent,
  BrowserUserRoleChangedEvent,
  MonolithicUserRoleChangedEvent,
  SocketPollingUserRoleChangedEvent,
} from "@com.xcodeclazz/mq";

export async function sendToAll(c: amqp.Connection, d: CodeUserRoleChangedEvent["payload"]) {
  try {
    new BatchUserRoleChangedProducer(c).send_to_queue(d);
    new CodeUserRoleChangedProducer(c).send_to_queue(d);
    new LiveUserRoleChangedProducer(c).send_to_queue(d);
    new NotesUserRoleChangedProducer(c).send_to_queue(d);
    new AdminUserRoleChangedProducer(c).send_to_queue(d);
    new BrowserUserRoleChangedProducer(c).send_to_queue(d);
    new MonolithicUserRoleChangedProducer(c).send_to_queue(d);
    new SocketPollingUserRoleChangedProducer(c).send_to_queue(d);
  } catch(error) {
    // @ts-ignore
    console.log(error?.message);
  }
}

export class BatchUserRoleChangedProducer extends ProducerBase<BatchUserRoleChangedEvent> { subject: Subjects.BATCH.USER_ROLE_CHANGED = Subjects.BATCH.USER_ROLE_CHANGED; }
export class CodeUserRoleChangedProducer extends ProducerBase<CodeUserRoleChangedEvent> { subject: Subjects.CODE.USER_ROLE_CHANGED = Subjects.CODE.USER_ROLE_CHANGED; }
export class LiveUserRoleChangedProducer extends ProducerBase<LiveUserRoleChangedEvent> { subject: Subjects.LIVE.USER_ROLE_CHANGED = Subjects.LIVE.USER_ROLE_CHANGED; }
export class NotesUserRoleChangedProducer extends ProducerBase<NotesUserRoleChangedEvent> { subject: Subjects.NOTES.USER_ROLE_CHANGED = Subjects.NOTES.USER_ROLE_CHANGED; }
export class AdminUserRoleChangedProducer extends ProducerBase<AdminUserRoleChangedEvent> { subject: Subjects.ADMIN.USER_ROLE_CHANGED = Subjects.ADMIN.USER_ROLE_CHANGED; }
export class BrowserUserRoleChangedProducer extends ProducerBase<BrowserUserRoleChangedEvent> { subject: Subjects.BROWSER.USER_ROLE_CHANGED = Subjects.BROWSER.USER_ROLE_CHANGED; }
export class MonolithicUserRoleChangedProducer extends ProducerBase<MonolithicUserRoleChangedEvent> { subject: Subjects.MONOLITHIC.USER_ROLE_CHANGED = Subjects.MONOLITHIC.USER_ROLE_CHANGED; }
export class SocketPollingUserRoleChangedProducer extends ProducerBase<SocketPollingUserRoleChangedEvent> { subject: Subjects.SOCKET_POLLING.USER_ROLE_CHANGED = Subjects.SOCKET_POLLING.USER_ROLE_CHANGED; }