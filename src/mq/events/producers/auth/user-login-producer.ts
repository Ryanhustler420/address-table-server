import * as amqp from "amqplib";
import {
  Subjects,
  ProducerBase,
  CodeUserLoggedInEvent,
  LiveUserLoggedInEvent,
  BatchUserLoggedInEvent,
  NotesUserLoggedInEvent,
  AdminUserLoggedInEvent,
  BrowserUserLoggedInEvent,
  MonolithicUserLoggedInEvent,
  SocketPollingUserLoggedInEvent,
} from "@com.xcodeclazz/mq";

export async function sendToAll(c: amqp.Connection, d: CodeUserLoggedInEvent["payload"]) {
  try {
    new BatchUserLoggedInProducer(c).send_to_queue(d);
    new LiveUserLoggedInProducer(c).send_to_queue(d);
    new AdminUserLoggedInProducer(c).send_to_queue(d);
    new MonolithicUserLoggedInProducer(c).send_to_queue(d);
  } catch(error) {
    // @ts-ignore
    console.log(error?.message);
  }
}

export class BatchUserLoggedInProducer extends ProducerBase<BatchUserLoggedInEvent> { subject: Subjects.BATCH.USER_LOGGED_IN = Subjects.BATCH.USER_LOGGED_IN; }
export class CodeUserLoggedInProducer extends ProducerBase<CodeUserLoggedInEvent> { subject: Subjects.CODE.USER_LOGGED_IN = Subjects.CODE.USER_LOGGED_IN; }
export class LiveUserLoggedInProducer extends ProducerBase<LiveUserLoggedInEvent> { subject: Subjects.LIVE.USER_LOGGED_IN = Subjects.LIVE.USER_LOGGED_IN; }
export class NotesUserLoggedInProducer extends ProducerBase<NotesUserLoggedInEvent> { subject: Subjects.NOTES.USER_LOGGED_IN = Subjects.NOTES.USER_LOGGED_IN; }
export class AdminUserLoggedInProducer extends ProducerBase<AdminUserLoggedInEvent> { subject: Subjects.ADMIN.USER_LOGGED_IN = Subjects.ADMIN.USER_LOGGED_IN; }
export class BrowserUserLoggedInProducer extends ProducerBase<BrowserUserLoggedInEvent> { subject: Subjects.BROWSER.USER_LOGGED_IN = Subjects.BROWSER.USER_LOGGED_IN; }
export class MonolithicUserLoggedInProducer extends ProducerBase<MonolithicUserLoggedInEvent> { subject: Subjects.MONOLITHIC.USER_LOGGED_IN = Subjects.MONOLITHIC.USER_LOGGED_IN; }
export class SocketPollingUserLoggedInProducer extends ProducerBase<SocketPollingUserLoggedInEvent> { subject: Subjects.SOCKET_POLLING.USER_LOGGED_IN = Subjects.SOCKET_POLLING.USER_LOGGED_IN; }