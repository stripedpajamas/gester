export const isId = str => /^@([A-Za-z0-9/+]{43}=)\.(?:sha256|ed25519)$/.test(str)
