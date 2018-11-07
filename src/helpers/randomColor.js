// this will be used if we need any random color
export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// gets a random color from our premade list of colors
const getRandomColor = (colors) => {
  const rnd = [Math.floor(Math.random() * (colors.everyone.length - 1))]
  return colors.everyone[rnd]
}

// creates an object of users/colors
// a user has a color assigned to them
// dont want to make it unique because we may not have enough colors
const colorMap = {}
export const getAuthorColor = (author, colors) => {
  if (!colorMap[author]) {
    colorMap[author] = getRandomColor(colors)
  }
  return colorMap[author]
}

export const getMeColor = () => colors.me
