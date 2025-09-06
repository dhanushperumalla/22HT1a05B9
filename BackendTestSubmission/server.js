import express from "express"
import dotenv from "dotenv"
import { logEvent, loggerMiddleware } from "../LoggingMiddleware/logger.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(loggerMiddleware(process.env.ACCESS_TOKEN))

const users = []
const orders = []

app.get("/health", async (req, res) => {
  await logEvent("backend", "info", "route", "health check success", process.env.ACCESS_TOKEN)
  res.json({ status: "ok" })
})

app.get("/users", async (req, res) => {
  try {
    if (users.length === 0) {
      await logEvent("backend", "warn", "repository", "no users found", process.env.ACCESS_TOKEN)
      return res.json({ users: [] })
    }
    await logEvent("backend", "info", "repository", "fetched users list", process.env.ACCESS_TOKEN)
    res.json({ users })
  } catch (err) {
    await logEvent("backend", "error", "handler", err.message, process.env.ACCESS_TOKEN)
    res.status(500).json({ error: "could not fetch users" })
  }
})

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email) {
      await logEvent("backend", "error", "handler", "missing name or email", process.env.ACCESS_TOKEN)
      return res.status(400).json({ error: "name and email required" })
    }
    const user = { id: users.length + 1, name, email }
    users.push(user)
    await logEvent("backend", "info", "controller", `user created: ${name}`, process.env.ACCESS_TOKEN)
    res.json(user)
  } catch (err) {
    await logEvent("backend", "fatal", "handler", err.message, process.env.ACCESS_TOKEN)
    res.status(500).json({ error: "internal server error" })
  }
})

app.post("/orders", async (req, res) => {
  try {
    const { userId, item } = req.body
    if (!userId || !item) {
      await logEvent("backend", "error", "handler", "missing userId or item", process.env.ACCESS_TOKEN)
      return res.status(400).json({ error: "userId and item required" })
    }
    const user = users.find(u => u.id === userId)
    if (!user) {
      await logEvent("backend", "warn", "db", `user not found for order: ${userId}`, process.env.ACCESS_TOKEN)
      return res.status(404).json({ error: "user not found" })
    }
    const order = { id: orders.length + 1, userId, item }
    orders.push(order)
    await logEvent("backend", "info", "service", `order created for user ${userId}`, process.env.ACCESS_TOKEN)
    res.json(order)
  } catch (err) {
    await logEvent("backend", "fatal", "service", err.message, process.env.ACCESS_TOKEN)
    res.status(500).json({ error: "could not create order" })
  }
})

app.get("/orders", async (req, res) => {
  try {
    if (orders.length === 0) {
      await logEvent("backend", "warn", "repository", "no orders found", process.env.ACCESS_TOKEN)
      return res.json({ orders: [] })
    }
    await logEvent("backend", "info", "repository", "fetched orders", process.env.ACCESS_TOKEN)
    res.json({ orders })
  } catch (err) {
    await logEvent("backend", "error", "repository", err.message, process.env.ACCESS_TOKEN)
    res.status(500).json({ error: "could not fetch orders" })
  }
})

app.use(async (err, req, res, next) => {
  await logEvent("backend", "fatal", "handler", err.message, process.env.ACCESS_TOKEN)
  res.status(500).json({ error: "unhandled exception" })
})

app.listen(process.env.PORT || 3000)
