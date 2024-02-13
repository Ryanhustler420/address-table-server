import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserLoggedInEvent,
} from "@com.xcodeclazz/mq";

export class UserLoggedInConsumer extends ConsumerBase<CompilersUserLoggedInEvent> {
  protected subject: Subjects.COMPILERS.USER_LOGGED_IN = Subjects.COMPILERS.USER_LOGGED_IN;
  protected onParsedData(queue: string, message: amqp.ConsumeMessage | null): void {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
