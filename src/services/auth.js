export const token_key = "@instagram_token"
export const is_authenticated = () => localStorage.getItem(token_key) !== null
export const get_token = () => localStorage.getItem(token_key)
export const sign_in = token => {
  localStorage.setItem(token_key, token)
}
export const logout = () => {
  localStorage.removeItem(token_key)
}