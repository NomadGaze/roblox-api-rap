import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

async function getRAP(userId) {
  const url = `https://economy.roblox.com/v2/users/${userId}/inventory?assetType=Collectible`;

  let rap = 0;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.data) {
      for (const item of data.data) {
        if (item.recentAveragePrice) {
          rap += item.recentAveragePrice;
        }
      }
    }
  } catch (err) {
    console.log("Error fetching RAP:", err);
  }

  return rap;
}

app.get("/rap", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json({ error: "Missing userId" });

  const rap = await getRAP(userId);
  res.json({ rap });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
