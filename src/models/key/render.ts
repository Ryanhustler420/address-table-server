import mongoose from "mongoose";
import { Password } from "../../services/password";
import { RenderAttrs } from "@com.xcodeclazz/address-table-server";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface RenderMongoDocument extends mongoose.Document, RenderAttrs {
  version: number;
}

interface RenderModel extends mongoose.Model<RenderMongoDocument> {
  build(attrs: RenderAttrs): RenderMongoDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<RenderMongoDocument | null>;
}

const renderSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true
    },
    serviceId: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      require: true,
      default: true,
    },
    isLocked: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

renderSchema.index({ capacity: 1 });
renderSchema.set("versionKey", "version");
renderSchema.plugin(updateIfCurrentPlugin);

renderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Render.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

renderSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

renderSchema.statics.build = (attrs: RenderAttrs) => {
  return new Render<RenderAttrs>(attrs);
};

renderSchema.methods.isBanned = async function () {
  return this.is_banned;
};

const Render = mongoose.model<RenderMongoDocument, RenderModel>(
  "Render",
  renderSchema
);
export { Render };
