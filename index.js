const express = require("express");
var unirest = require("unirest");
const multer = require('multer');
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3005;
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Disable SSL certificate verification
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.post("/subscribe", async (req, res) => {
  try {
    // const targetUrl = "http://mailer.punteer.com" + req.url;
    const targetUrl = "https://mailer.punteer.com/sender/subscribe";
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    var req = unirest("POST", targetUrl)
      .headers({
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .send(`api_key=${process.env.API_KEY}`)
      .send(`list=${process.env.LIST_ID}`)
      .send("email=" + req.body.email)
      .send(`name=${req?.body?.name ?? ""}`)
      .send("boolean=true")
      .end(function (resp) {
        if (resp.error) throw new Error(resp.error);
        console.log({ resp });
        let message = "success";
        if (resp.body === "1") {
          message = "You have been added to our waitlist.";
        } else {
          message = resp.body;
        }
        res.status(resp.status).json({ data: resp.body });
      });

    // console.log({ response: response.body });
    // console.log({ responseData });

    // Forward the response headers
    // response.headers.forEach((value, key) => {
    //   res.setHeader(key, value);
    // });    res.json({ message: "success" });
    // res.status(response.status).json(responseData);
  } catch (error) {
    console.log({ error });
    res.status(500).send("Error proxying the request");
  }
});

app.get("/count", async (req, res) => {
  try {
    // const targetUrl = "http://mailer.punteer.com" + req.url;
    const targetUrl =
      "https://mailer.punteer.com/sender/api/subscribers/active-subscriber-count.php";

    var req = unirest("POST", targetUrl)
      .headers({
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .send(`api_key=${process.env.API_KEY}`)
      .send(`list_id=${process.env.LIST_ID}`)
      .send("boolean=true")
      .end(function (resp) {
        if (resp.error) throw new Error(resp.error);
        console.log({ resp });
        res.status(resp.status).json({ data: resp.body });
      });

    // console.log({ response: response.body });
    // console.log({ responseData });

    // Forward the response headers
    // response.headers.forEach((value, key) => {
    //   res.setHeader(key, value);
    // });
    // res.status(response.status).json(responseData);
  } catch (error) {
    console.log({ error });
    res.status(500).send("Error proxying the request");
  }
});

// Set up multer for handling multipart/form-data
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

app.post('/convert-to-base64', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileBuffer = req.file.buffer;
  const base64Data = fileBuffer.toString('base64');

  res.json({ data: base64Data });
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
