const jsonServer = require("json-server");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(jsonServer.bodyParser);
server.use([
  (req, res, next) => {
    console.log("reqqqq", req.body);
    return next();
  },
  ...middlewares,
  cors({ origin: "*" }),
]);

const BASE_URL = "http://localhost:3080";
// const BASE_URL = "https://elpod.novorostorgi.ru/api/api";
server.post("/api/ep_requests", async (req, res) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/ep_requests`, {
      ...req.body,
    });
    return res.send(data).end();
  } catch (err) {
    console.log("errr", err);
    res.status(500).end();
  }
});

server.use(router);

server.listen(3080, () => {
  console.log("JSON Server is running");
});
