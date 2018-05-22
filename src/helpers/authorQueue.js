let authorQueue = []

export const getAuthorQueue = () => authorQueue
export const getAuthorQueueLength = () => authorQueue.length
export const pushAuthorQueue = (author) => { authorQueue.push(author) }
export const resetAuthorQueue = () => { authorQueue = [] }
