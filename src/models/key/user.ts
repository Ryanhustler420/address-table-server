import mongoose from "mongoose";
import {
  Roles,
  Genders,
  UserAttrs,
  ITopicStatus,
  ISubscribeCourse,
  IQuestionSolvedStatus,
} from "@com.xcodeclazz/monolithic-common";
import { Password } from "@com.xcodeclazz/monolithic-common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface UserMongoDocument extends mongoose.Document, UserAttrs {
  version: number;
  isBanned(): Promise<boolean>;
  findCourseStatusById(course: mongoose.Types.ObjectId): {
    item: ISubscribeCourse;
    pos: number;
  };
  getScoreAndSolvedSumOfAllTopics(course: mongoose.Types.ObjectId): {
    t_score: number;
    t_solved: number;
  };
  findTopicStatusById(
    course: mongoose.Types.ObjectId,
    topic: mongoose.Types.ObjectId
  ): {
    item: ITopicStatus;
    pos: number;
  };
  findQuestionStatusById(
    course: mongoose.Types.ObjectId,
    topic: mongoose.Types.ObjectId,
    question: mongoose.Types.ObjectId
  ): {
    item: IQuestionSolvedStatus;
    pos: number;
  };
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
    activeCourse: mongoose.Schema.Types.Mixed,
    coursesSubscribed: [mongoose.Schema.Types.Mixed],
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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User<UserAttrs>(attrs);
};

userSchema.methods.isBanned = async function () {
  return this.is_banned;
};

userSchema.methods.findCourseStatusById = function (
  course: mongoose.Types.ObjectId
) {
  let item = undefined;
  let pos = this?.coursesSubscribed.findIndex((e: ISubscribeCourse) =>
    e.course?.equals(course)
  );
  if (pos != -1) item = this?.coursesSubscribed?.at(pos);
  return { item, pos };
};

userSchema.methods.getScoreAndSolvedSumOfAllTopics = function (
  course: mongoose.Types.ObjectId
) {
  const found = this.findCourseStatusById(course);
  if (found.item) {
    return found.item.topics.reduce((prev: any, curr: ITopicStatus) => {
      prev.t_solved += curr.solved.length;
      prev.t_score += curr.score.value;
      return prev;
    }, { t_score: 0, t_solved: 0 });
  } else return { t_score: 0, t_solved: 0 };
};

userSchema.methods.findTopicStatusById = function (
  course: mongoose.Types.ObjectId,
  topic: mongoose.Types.ObjectId
) {
  let pos = -1;
  let item = undefined;
  const found = this.findCourseStatusById(course);
  if (found.item) {
    pos = found.item.topics.findIndex((e: ITopicStatus) =>
      e.topic?.equals(topic)
    );
    if (pos != -1) item = found.item.topics.at(pos);
    return { item, pos };
  } else return { item, pos };
};

userSchema.methods.findQuestionStatusById = function (
  course: mongoose.Types.ObjectId,
  topic: mongoose.Types.ObjectId,
  question: mongoose.Types.ObjectId
) {
  let pos = -1;
  let item = undefined;
  const found = this.findTopicStatusById(course, topic);
  if (found.item) {
    pos = found.item.solved.findIndex((e: IQuestionSolvedStatus) =>
      e.question?.equals(question)
    );
    if (pos != -1) item = found.item.solved.at(pos);
    return { item, pos };
  } else return { item, pos };
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserMongoDocument, UserModel>("User", userSchema);
export { User };
