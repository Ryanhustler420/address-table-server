import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserLoggedOutEvent,
} from "@com.xcodeclazz/mq";

export class UserLoggedOutConsumer extends ConsumerBase<CompilersUserLoggedOutEvent> {
  protected subject: Subjects.COMPILERS.USER_LOGGED_OUT = Subjects.COMPILERS.USER_LOGGED_OUT;
  async onParsedData(queue: string, data: CompilersUserLoggedOutEvent['payload'], message: amqp.ConsumeMessage | null) {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
