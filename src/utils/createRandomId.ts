export const createRandomId = (): number => {
  return Math.floor(Date.now() * Math.random());
};
