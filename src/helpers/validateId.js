export const isId = (str) => {
    const idRegex = /^@[a-zA-Z\/0-9+]+=.ed25519$/g
    return idRegex.test(str)
}
