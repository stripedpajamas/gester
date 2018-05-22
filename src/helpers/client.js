let client

const setClient = (c) => { client = c }
const getClient = () => client

module.exports = {
  setClient,
  getClient
}
