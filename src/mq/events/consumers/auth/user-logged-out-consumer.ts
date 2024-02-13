import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserLoggedOutEvent,
} from "@com.xcodeclazz/mq";

export class UserLoggedOutConsumer extends ConsumerBase<CompilersUserLoggedOutEvent> {
  protected subject: Subjects.COMPILERS.USER_LOGGED_OUT = Subjects.COMPILERS.USER_LOGGED_OUT;
  protected onParsedData(queue: string, message: amqp.ConsumeMessage | null): void {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
