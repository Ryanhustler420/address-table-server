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

export function* numberSequenceGenerator(resetNumber: number): Generator<number, void, unknown> {
  let count = 1;
  while (true) {
    yield count;
    count = (count % resetNumber) + 1;
  }
};

export function randomId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }
  return result;
}