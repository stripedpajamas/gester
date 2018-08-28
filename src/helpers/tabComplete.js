import emojis from 'node-emoji'
import core from 'ssb-chat-core'

const emojiList = Object.keys(emojis.emoji).map(e => `:${e}:`)

const author = (partial) => core.authors.findMatches(partial)

const emoji = (partial) => {
  // finding emojis that start with the partial
  // we want to show these as options first
  const startEmojis = emojiList.filter(em => em.startsWith(partial))
  // finding emojis that contain the partial
  const partialEmojis = emojiList.filter(em => em.includes(partial.slice(1)))
  // returning the emojis that start with the partial and then the emojis that contain the partial
  return [...new Set(startEmojis.concat(partialEmojis))]
}

export default (line) => {
  const split = line.split(' ')
  let beginning = split.slice(0, split.length - 1).join(' ')
  let lastWord = split[split.length - 1]
  let matches = []

  if (lastWord.indexOf(':') === 0) { // emoji
    matches = emoji(lastWord)
  } else {
    // if they didn't include an @ symbol, put one on
    if (lastWord.indexOf('@') !== 0) {
      lastWord = `@${lastWord}`
    }

    matches = author(lastWord)
  }

  // keep a separation between what's being tab-completed and what came before
  if (beginning) {
    beginning = `${beginning} `
  }

  let idx = -1
  return () => (matches.length && `${beginning}${matches[++idx % matches.length]}`) || line
}
