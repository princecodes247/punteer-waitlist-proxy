const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.all("/*", async (req, res) => {
  try {
    const targetUrl = "https://mailer.punteer.com/" + req.url;
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body,
    });

    // Forward the response headers
    Object.keys(response.headers).forEach((key) => {
      res.setHeader(key, response.headers[key]);
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send("Error proxying the request");
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
