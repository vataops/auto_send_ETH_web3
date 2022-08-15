// sendEther.js
require('dotenv').config()

// const TELEGRAM_TOKEN = process.env.telegram-token;
// const TELEGRAM_CHAT_ID = "오직 해커를 위함";

// const telegramApi = new TelegramApi(TELEGRAM_TOKEN);
  
  var Web3 = require("web3")
  var fs = require("fs")
  var Tx = require("ethereumjs-tx") // ethereumjs-tx version 1.3.7 사용. (최신 버전을 사용할 경우에는 constructor 관련 에러와 invalid sender 에러가 떠서 버전 수정하였습니다.)
  var infura_token = process.env.infuraFileToken
  var private_key = process.env.privateKey
  var node_host = `https://ropsten.infura.io/v3/${infura_token}`
  
  var web3 = new Web3(node_host)

  const send_account = process.env.send_account // send account
  const receive_account = process.env.receive_account //  receiver account
  const privateKeyBuffer = Buffer.from(private_key, "hex")
  
  function send(){
  web3.eth.getTransactionCount(send_account, (err, txCount) => { // (1)
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      to: receive_account,
      value: "0x00470DE4DF820000", // 0.2 hexcode 변경 
    }
  
    const tx = new Tx(txObject)
    tx.sign(privateKeyBuffer)
  
    const serializedTx = tx.serialize()
    const raw = "0x" + serializedTx.toString("hex")
  
    web3.eth  
      .sendSignedTransaction(raw) //(2)
      .once("transactionHash", hash => {
        // telegramApi.sendMessage(TELEGRAM_CHAT_ID, "tx가 pending됨. 트랜잭션 실행되었음");
        console.info("transactionHash", "https://ropsten.etherscan.io/tx/" + hash) // tx가 pending되는 즉시 etherscan에서 tx진행상태를 보여주는 링크를 제공해줍니다.
      })
      .once("receipt", receipt => {
        // telegramApi.sendMessage(TELEGRAM_CHAT_ID, "receipt :" + receipt);
        console.info("receipt", receipt) // 터미널에 receipt 출력
      })
      .on("error", console.error)
  })
  }

  setInterval(() => send(), 5000);
