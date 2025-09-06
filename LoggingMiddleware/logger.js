import axios from "axios"

const URL = "http://20.244.56.144/evaluation-service/logs"

export async function logEvent(stack, level, pkg, message, token) {
  try {
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    const payload = { stack, level, package: pkg, message }
    const { data } = await axios.post(URL, payload, { headers })
    return data
  } catch (err) {
    return { error: err.message }
  }
}

export function loggerMiddleware(token) {
  return async (req, res, next) => {
    await logEvent("backend", "info", "middleware", `${req.method} ${req.url}`, token)
    next()
  }
}
