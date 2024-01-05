import _ from "lodash";

export const hasAllKeysWithSameValues = (
  obj1: { [key: string]: {} },
  obj2: { [key: string]: {} }
) => {
  // return _.every(
  //   obj2,
  //   (value, key) => _.has(obj1, key) && _.isEqual(obj1[key], value)
  // );
  return _.every(obj1, (value, key) => _.isEqual(value, obj2[key]));
};
