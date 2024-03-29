import * as amqp from "amqplib/callback_api";
import { User } from "../../../../models/key/user";
import { toObjectId } from "@com.xcodeclazz/monolithic-common";
import {
  Subjects,
  ConsumerBase,
  CompilersUserRegisteredEvent,
} from "@com.xcodeclazz/mq";

export class UserRegisteredConsumer extends ConsumerBase<CompilersUserRegisteredEvent> {
  protected subject: Subjects.COMPILERS.USER_REGISTERED = Subjects.COMPILERS.USER_REGISTERED;
  async onParsedData(queue: string, data: CompilersUserRegisteredEvent['payload'], message: amqp.ConsumeMessage | null) {
    const user = await User.findOne({ email: data.email });
    if (user) return;

    const newUser = User.build(data);
    newUser.set({ _id: toObjectId(data.user) });
    await newUser.save();
  }
}
