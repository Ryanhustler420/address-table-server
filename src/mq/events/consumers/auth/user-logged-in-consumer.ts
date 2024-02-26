import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserLoggedInEvent,
} from "@com.xcodeclazz/mq";

export class UserLoggedInConsumer extends ConsumerBase<CompilersUserLoggedInEvent> {
  protected subject: Subjects.COMPILERS.USER_LOGGED_IN = Subjects.COMPILERS.USER_LOGGED_IN;
  async onParsedData(queue: string, data: CompilersUserLoggedInEvent['payload'], message: amqp.ConsumeMessage | null) {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
