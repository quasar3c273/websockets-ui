export const createRandomNum = () => {
  const randomNum = Math.random()
  const multiplier = 1000000
  const timestamp = Date.now()

  return Math.floor(randomNum * multiplier) + timestamp
}
