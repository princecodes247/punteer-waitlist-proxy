const express = require("express");
const exec = require("child_process").exec;
const app = express();
app.get("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.post("/send", (req, res) => {
  var args = ` -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "api_key=fNVWjgj4YChkkDwKGCad&list=6KNZZ3SCb41cOUwVmJFAag&name=Prince%20Codes&email=princecodes247%40gmail.com&boolean=true" -v -i -w "Response Code: %{response_code} %{response_body}" https://mailer.punteer.com/sender/subscribe`;

  exec("curl " + args, function (error, stdout, stderr) {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
    res.send({
      stdout: stdout,
      error: error,
      bo: "TYO",
    });
  });
});

app.listen(process.env.PORT || 3005, () => console.log("Server is running..."));
