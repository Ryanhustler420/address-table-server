import { Render } from "../../../models/key/render";

const timeout = 1000 * 10; // seconds

const reduceCapacity = async (url: string) => {
  await Render.findOneAndUpdate({ url }, { $inc: { capacity: -1 } });
  setTimeout(async () => {
    await Render.findOneAndUpdate({ url }, { $inc: { capacity: +1 } });
  }, timeout);
};

export const getFreeUrlByTags = async (tags: string[]) => {
  const render = await Render.findOne({
    tags: { $in: tags },
    capacity: { $gt: 0 },
  });
  if (render) {
    await reduceCapacity(render.url);
    return render;
  }
  return null;
};
