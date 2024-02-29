import * as amqp from "amqplib/callback_api";
import { User } from "../../../../models/key/user";
import {
  Subjects,
  ConsumerBase,
  CompilersUserBannedEvent,
} from "@com.xcodeclazz/mq";

export class UserBannedConsumer extends ConsumerBase<CompilersUserBannedEvent> {
  protected subject: Subjects.COMPILERS.USER_BANNED = Subjects.COMPILERS.USER_BANNED;
  async onParsedData(queue: string, data: CompilersUserBannedEvent['payload'], message: amqp.ConsumeMessage | null) {

    const user = await User.findById(data.user);
    if (!user) return;

    user.set({ is_banned: true });
    await user.save();
  }
}
