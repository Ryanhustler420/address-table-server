import * as amqp from "amqplib";
import {
  Subjects,
  ProducerBase,
  CodeUserLoggedOutEvent,
  LiveUserLoggedOutEvent,
  BatchUserLoggedOutEvent,
  NotesUserLoggedOutEvent,
  AdminUserLoggedOutEvent,
  BrowserUserLoggedOutEvent,
  MonolithicUserLoggedOutEvent,
  SocketPollingUserLoggedOutEvent,
} from "@com.xcodeclazz/mq";

export async function sendToAll(c: amqp.Connection, d: CodeUserLoggedOutEvent["payload"]) {
  try {
    new BatchUserLoggedOutProducer(c).send_to_queue(d);
    new LiveUserLoggedOutProducer(c).send_to_queue(d);
    new AdminUserLoggedOutProducer(c).send_to_queue(d);
    new MonolithicUserLoggedOutProducer(c).send_to_queue(d);
  } catch(error) {
    // @ts-ignore
    console.log(error?.message);
  }
}

export class BatchUserLoggedOutProducer extends ProducerBase<BatchUserLoggedOutEvent> { subject: Subjects.BATCH.USER_LOGGED_OUT = Subjects.BATCH.USER_LOGGED_OUT; }
export class CodeUserLoggedOutProducer extends ProducerBase<CodeUserLoggedOutEvent> { subject: Subjects.CODE.USER_LOGGED_OUT = Subjects.CODE.USER_LOGGED_OUT; }
export class LiveUserLoggedOutProducer extends ProducerBase<LiveUserLoggedOutEvent> { subject: Subjects.LIVE.USER_LOGGED_OUT = Subjects.LIVE.USER_LOGGED_OUT; }
export class NotesUserLoggedOutProducer extends ProducerBase<NotesUserLoggedOutEvent> { subject: Subjects.NOTES.USER_LOGGED_OUT = Subjects.NOTES.USER_LOGGED_OUT; }
export class AdminUserLoggedOutProducer extends ProducerBase<AdminUserLoggedOutEvent> { subject: Subjects.ADMIN.USER_LOGGED_OUT = Subjects.ADMIN.USER_LOGGED_OUT; }
export class BrowserUserLoggedOutProducer extends ProducerBase<BrowserUserLoggedOutEvent> { subject: Subjects.BROWSER.USER_LOGGED_OUT = Subjects.BROWSER.USER_LOGGED_OUT; }
export class MonolithicUserLoggedOutProducer extends ProducerBase<MonolithicUserLoggedOutEvent> { subject: Subjects.MONOLITHIC.USER_LOGGED_OUT = Subjects.MONOLITHIC.USER_LOGGED_OUT; }
export class SocketPollingUserLoggedOutProducer extends ProducerBase<SocketPollingUserLoggedOutEvent> { subject: Subjects.SOCKET_POLLING.USER_LOGGED_OUT = Subjects.SOCKET_POLLING.USER_LOGGED_OUT; }