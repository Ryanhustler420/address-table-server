import mongoose from "mongoose";
import { Password } from "../../services/password";
import { Genders, Roles } from "@com.xcodeclazz/monolithic-common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface UserAttrs {
  address: string;
  country: string;
  gender: Genders;
  avatar: string;
  phone: string;
  state: string;
  email: string;
  name: string;
  city: string;
  dob: string;
  roles?: Roles[];
  password?: string;
  is_banned?: boolean;
}

export interface UserMongoDocument extends mongoose.Document, UserAttrs {
  version: number;
  isBanned(): Promise<boolean>;
}

interface UserModel extends mongoose.Model<UserMongoDocument> {
  build(attrs: UserAttrs): UserMongoDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<UserMongoDocument | null>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: Genders,
    },
    avatar: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      required: true,
      enum: Roles,
    },
    is_banned: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User<UserAttrs>(attrs);
};

userSchema.methods.isBanned = async function () {
  return this.is_banned;
};

const User = mongoose.model<UserMongoDocument, UserModel>("User", userSchema);
export { User };
