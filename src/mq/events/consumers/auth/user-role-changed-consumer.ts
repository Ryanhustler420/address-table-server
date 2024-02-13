import * as amqp from "amqplib/callback_api";
import {
  Subjects,
  ConsumerBase,
  CompilersUserRoleChanedEvent,
} from "@com.xcodeclazz/mq";

export class UserRoleChanedConsumer extends ConsumerBase<CompilersUserRoleChanedEvent> {
  protected subject: Subjects.COMPILERS.USER_ROLE_CHANGED = Subjects.COMPILERS.USER_ROLE_CHANGED;
  protected onParsedData(queue: string, message: amqp.ConsumeMessage | null): void {
    // console.log("appname", queue, message?.content.toString(), data);
  }
}
