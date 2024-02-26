import * as amqp from "amqplib";
import {
  Subjects,
  ProducerBase,
  CodeUserBannedEvent,
  LiveUserBannedEvent,
  BatchUserBannedEvent,
  NotesUserBannedEvent,
  AdminUserBannedEvent,
  BrowserUserBannedEvent,
  MonolithicUserBannedEvent,
  SocketPollingUserBannedEvent,
} from "@com.xcodeclazz/mq";

export async function sendToAll(c: amqp.Connection, d: CodeUserBannedEvent["payload"]) {
  try {
    new BatchUserBannedProducer(c).send_to_queue(d);
    new CodeUserBannedProducer(c).send_to_queue(d);
    new LiveUserBannedProducer(c).send_to_queue(d);
    new NotesUserBannedProducer(c).send_to_queue(d);
    new AdminUserBannedProducer(c).send_to_queue(d);
    new BrowserUserBannedProducer(c).send_to_queue(d);
    new MonolithicUserBannedProducer(c).send_to_queue(d);
    new SocketPollingUserBannedProducer(c).send_to_queue(d);
  } catch(error) {
    // @ts-ignore
    console.log(error?.message);
  }
}

export class BatchUserBannedProducer extends ProducerBase<BatchUserBannedEvent> { protected subject: Subjects.BATCH.USER_BANNED = Subjects.BATCH.USER_BANNED;} 
export class CodeUserBannedProducer extends ProducerBase<CodeUserBannedEvent> { subject: Subjects.CODE.USER_BANNED = Subjects.CODE.USER_BANNED; }
export class LiveUserBannedProducer extends ProducerBase<LiveUserBannedEvent> { subject: Subjects.LIVE.USER_BANNED = Subjects.LIVE.USER_BANNED; }
export class NotesUserBannedProducer extends ProducerBase<NotesUserBannedEvent> { subject: Subjects.NOTES.USER_BANNED = Subjects.NOTES.USER_BANNED; }
export class AdminUserBannedProducer extends ProducerBase<AdminUserBannedEvent> { subject: Subjects.ADMIN.USER_BANNED = Subjects.ADMIN.USER_BANNED; }
export class BrowserUserBannedProducer extends ProducerBase<BrowserUserBannedEvent> { subject: Subjects.BROWSER.USER_BANNED = Subjects.BROWSER.USER_BANNED; }
export class MonolithicUserBannedProducer extends ProducerBase<MonolithicUserBannedEvent> { subject: Subjects.MONOLITHIC.USER_BANNED = Subjects.MONOLITHIC.USER_BANNED; }
export class SocketPollingUserBannedProducer extends ProducerBase<SocketPollingUserBannedEvent> { subject: Subjects.SOCKET_POLLING.USER_BANNED = Subjects.SOCKET_POLLING.USER_BANNED; }