import * as amqp from "amqplib";
import {
  Subjects,
  ProducerBase,
  CodeUserRegisteredEvent,
  LiveUserRegisteredEvent,
  BatchUserRegisteredEvent,
  NotesUserRegisteredEvent,
  AdminUserRegisteredEvent,
  BrowserUserRegisteredEvent,
  MonolithicUserRegisteredEvent,
  SocketPollingUserRegisteredEvent,
} from "@com.xcodeclazz/mq";

export async function sendToAll(c: amqp.Connection, d: CodeUserRegisteredEvent["payload"]) {
  try {
    new BatchUserRegisteredProducer(c).send_to_queue(d);
    new CodeUserRegisteredProducer(c).send_to_queue(d);
    new LiveUserRegisteredProducer(c).send_to_queue(d);
    new NotesUserRegisteredProducer(c).send_to_queue(d);
    new AdminUserRegisteredProducer(c).send_to_queue(d);
    new BrowserUserRegisteredProducer(c).send_to_queue(d);
    new MonolithicUserRegisteredProducer(c).send_to_queue(d);
    new SocketPollingUserRegisteredProducer(c).send_to_queue(d);
  } catch(error) {
    // @ts-ignore
    console.log(error?.message);
  }
}

export class BatchUserRegisteredProducer extends ProducerBase<BatchUserRegisteredEvent> { subject: Subjects.BATCH.USER_REGISTERED = Subjects.BATCH.USER_REGISTERED; }
export class CodeUserRegisteredProducer extends ProducerBase<CodeUserRegisteredEvent> { subject: Subjects.CODE.USER_REGISTERED = Subjects.CODE.USER_REGISTERED; }
export class LiveUserRegisteredProducer extends ProducerBase<LiveUserRegisteredEvent> { subject: Subjects.LIVE.USER_REGISTERED = Subjects.LIVE.USER_REGISTERED; }
export class NotesUserRegisteredProducer extends ProducerBase<NotesUserRegisteredEvent> { subject: Subjects.NOTES.USER_REGISTERED = Subjects.NOTES.USER_REGISTERED; }
export class AdminUserRegisteredProducer extends ProducerBase<AdminUserRegisteredEvent> { subject: Subjects.ADMIN.USER_REGISTERED = Subjects.ADMIN.USER_REGISTERED; }
export class BrowserUserRegisteredProducer extends ProducerBase<BrowserUserRegisteredEvent> { subject: Subjects.BROWSER.USER_REGISTERED = Subjects.BROWSER.USER_REGISTERED; }
export class MonolithicUserRegisteredProducer extends ProducerBase<MonolithicUserRegisteredEvent> { subject: Subjects.MONOLITHIC.USER_REGISTERED = Subjects.MONOLITHIC.USER_REGISTERED; }
export class SocketPollingUserRegisteredProducer extends ProducerBase<SocketPollingUserRegisteredEvent> { subject: Subjects.SOCKET_POLLING.USER_REGISTERED = Subjects.SOCKET_POLLING.USER_REGISTERED; }