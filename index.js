const express = require("express");
const path = require("path");

var Web3 = require('web3');
const secrets = require('./secrets');
console.log(secrets.INF_ID);

let web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/" + secrets.INF_ID
  )
);
var version = web3.version.api;

const app = express();
const port = process.env.PORT || "8000";

console.log("In index.js")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, './public')));

const getBlockHash = async () => {
  let blockNum = await web3.eth.getBlockNumber()
  console.log("blocknum", blockNum)
  let obj = await web3.eth.getBlock(blockNum);
  let blockHash = JSON.parse(JSON.stringify(obj)).hash
  console.log("blockhash", blockHash)
  return blockHash
}

app.get("/", async (req, res) => {
  let hash = await getBlockHash()
  console.log("Hash returned", hash)
  // await getBlockHash(num)
  res.render("index", { hash: hash });
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
