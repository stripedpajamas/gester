export const compare = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }
  const a = arr1.slice().sort()
  const b = arr2.slice().sort()
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

// sorts by timestamp
export const sort = (arr) => arr.sort((a, b) => {
  if (a.rawTime < b.rawTime) return -1
  if (a.rawTime > b.rawTime) return 1
  return 0
})
