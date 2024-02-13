import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserBannedEvent,
} from "@com.xcodeclazz/mq";

export class UserBannedConsumer extends ConsumerBase<CompilersUserBannedEvent> {
  protected subject: Subjects.COMPILERS.USER_BANNED = Subjects.COMPILERS.USER_BANNED;
  protected onParsedData(queue: string, message: amqp.ConsumeMessage | null): void {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
