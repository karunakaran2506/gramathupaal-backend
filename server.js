const app = require("./app");
const PORT = process.env.PORT;
const http = require("http");
const server = http.createServer(app);

//Server command
// NODE_ENV=production TZ='Asia/Calcutta' pm2 start server.js --name gramathupaal-02.06.2022-a

//Timezone set
process.env.TZ = "Asia/Kolkata";

// mongo db credentials
const mongoose = require("mongoose");
const uri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGOURIPROD
    : process.env.MONGOURITEST;

// mongo db connection
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, success) => {
    if (err) throw new err();

    server.listen(PORT, () => {
      console.log(
        `Gramathupaal Application is running successfully in ${PORT} and connected to database`
      );
    });
  }
);
