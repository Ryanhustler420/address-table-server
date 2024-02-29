import * as amqp from "amqplib/callback_api";
import { User } from "../../../../models/key/user";
import {
  Subjects,
  ConsumerBase,
  CompilersUserRoleChangedEvent,
} from "@com.xcodeclazz/mq";

export class UserRoleChangedConsumer extends ConsumerBase<CompilersUserRoleChangedEvent> {
  protected subject: Subjects.COMPILERS.USER_ROLE_CHANGED = Subjects.COMPILERS.USER_ROLE_CHANGED;
  async onParsedData(queue: string, data: CompilersUserRoleChangedEvent['payload'], message: amqp.ConsumeMessage | null) {
    const existingUser = await User.findById(data.user);
    if (!existingUser) return;

    existingUser.set({ roles: data.roles });
    await existingUser.save();
  }
}
