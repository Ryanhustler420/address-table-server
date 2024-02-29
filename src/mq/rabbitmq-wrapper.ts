import * as amqp from 'amqplib';
import { UserBannedConsumer } from './events/consumers/auth/user-banned-consumer';
import { UserLoggedInConsumer } from './events/consumers/auth/user-logged-in-consumer';
import { UserLoggedOutConsumer } from './events/consumers/auth/user-logged-out-consumer';
import { UserRegisteredConsumer } from './events/consumers/auth/user-registered-consumer';
import { UserRoleChangedConsumer } from './events/consumers/auth/user-role-changed-consumer';

class RabbitMqWrapper {
    private _connection: amqp.Connection | null = null;

    get conn() {
      if (!this._connection) throw new Error("Cannot access MQ before connecting");
      return this._connection;
    }

    async connect(url: string) {
      try {
        this._connection = await amqp.connect(url);
        console.log("Connected @", new Date());

        if (this.conn) {
          // todo: send alert, connected
          new UserBannedConsumer(this.conn).work_queue().catch(console.error);
          new UserLoggedInConsumer(this.conn).work_queue().catch(console.error);
          new UserLoggedOutConsumer(this.conn).work_queue().catch(console.error);
          new UserRegisteredConsumer(this.conn).work_queue().catch(console.error);
          new UserRoleChangedConsumer(this.conn).work_queue().catch(console.error);
        }

        this._connection.on("close", () => {
            console.error('Connection to RabbitMQ closed. Reconnecting...', new Date());
            // todo: send alert
            setTimeout(() => this.connect(url), 10000);
        });
      } catch (error) {
        // @ts-ignore
        console.error(error?.message, new Date());
        setTimeout(() => this.connect(url), 10000);
      }
    }
}

export const rabbitMqWrapper = new RabbitMqWrapper();