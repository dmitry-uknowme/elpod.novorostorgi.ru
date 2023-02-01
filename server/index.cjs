const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      //@ts-expect-error
      resolve(reader.result.replace(/^data:.+;base64,/, ""));
    reader.onerror = (error) => reject(error);
  });

const jsonServer = require("json-server");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

const router = jsonServer.router(path.join(__dirname, "db.json"));
const server = jsonServer.create();
const middlewares = jsonServer.defaults({ bodyParser: true });

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(formidableMiddleware());
// const middlewares = jsonServer.defaults({ bodyParser: true });
// server.use(jsonServer.bodyParser);
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

server.post("/test", async (req, res) => {
  const body = req.body;
  const fields = req.fields;

  console.log("bbbbb", req.files);

  // const innFileField = req.fields.file_inn;
  // const snilsFileField = req.fields.file_snils;
  const passportFileField = req.fields.file_passport;
  console.log("6444", Buffer.from(passportFileField, "base64"));
  // const innFile = innFileField ? await toBase64(innFileField) : null;
  // const snilsFile = await toBase64(snilsFileField);
  // const passportFile = await toBase64(passportFileField);
  // console.log("ppssss", passportFile);
  try {
    const { data } = await axios.post(
      "https://elpod.novorostorgi.ru/api/v1/lead/add",
      body
    );
    console.log("testttt", data);
  } catch (err) {
    console.log("testtt errr", err);
  }
});

server.use(router);

server.listen(3080, () => {
  console.log("JSON Server is running");
});
