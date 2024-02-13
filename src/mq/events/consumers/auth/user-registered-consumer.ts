import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserRegisteredEvent,
} from "@com.xcodeclazz/mq";

export class UserRegisteredConsumer extends ConsumerBase<CompilersUserRegisteredEvent> {
  protected subject: Subjects.COMPILERS.USER_REGISTERED = Subjects.COMPILERS.USER_REGISTERED;
  protected onParsedData(queue: string, message: amqp.ConsumeMessage | null): void {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
