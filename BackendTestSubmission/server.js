import express from "express";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { logEvent, loggerMiddleware } from "../LoggingMiddleware/logger.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(loggerMiddleware(process.env.ACCESS_TOKEN));

const urls = new Map();

app.post("/shorturls", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      await logEvent("backend", "error", "route", "Missing URL", process.env.ACCESS_TOKEN);
      return res.status(400).json({ error: "URL is required" });
    }

    let code = shortcode || nanoid(6);

    if (urls.has(code)) {
      await logEvent("backend", "error", "route", `Shortcode already exists: ${code}`, process.env.ACCESS_TOKEN);
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    const expiry = new Date(Date.now() + validity * 60000).toISOString();
    urls.set(code, {
      url,
      expiry,
      createdAt: new Date().toISOString(),
      clicks: [],
    });

    await logEvent("backend", "info", "route", `Short URL created: ${code}`, process.env.ACCESS_TOKEN);

    return res.status(201).json({
      shortLink: `http://localhost:${process.env.PORT || 3000}/${code}`,
      expiry,
    });
  } catch (err) {
    await logEvent("backend", "error", "route", err.message, process.env.ACCESS_TOKEN);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const data = urls.get(code);

    if (!data) {
      await logEvent("backend", "warn", "route", `Shortcode not found: ${code}`, process.env.ACCESS_TOKEN);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > new Date(data.expiry)) {
      await logEvent("backend", "warn", "route", `Shortcode expired: ${code}`, process.env.ACCESS_TOKEN);
      return res.status(410).json({ error: "Shortcode expired" });
    }

    data.clicks.push({
      time: new Date().toISOString(),
      referrer: req.headers["referer"] || "unknown",
      geo: "IN", 
    });

    await logEvent("backend", "info", "route", `Redirected shortcode: ${code}`, process.env.ACCESS_TOKEN);

    return res.redirect(data.url);
  } catch (err) {
    await logEvent("backend", "error", "route", err.message, process.env.ACCESS_TOKEN);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/shorturls/:code/stats", async (req, res) => {
  try {
    const { code } = req.params;
    const data = urls.get(code);

    if (!data) {
      await logEvent("backend", "warn", "route", `Stats requested for missing shortcode: ${code}`, process.env.ACCESS_TOKEN);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    await logEvent("backend", "info", "route", `Stats retrieved for shortcode: ${code}`, process.env.ACCESS_TOKEN);

    return res.json({
      originalUrl: data.url,
      createdAt: data.createdAt,
      expiry: data.expiry,
      clicks: data.clicks.length,
      clickDetails: data.clicks,
    });
  } catch (err) {
    await logEvent("backend", "error", "route", err.message, process.env.ACCESS_TOKEN);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
