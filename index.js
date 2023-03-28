// sendEther.js
require('dotenv').config()
var decimal = require('decimal')

  var Web3 = require("web3")
  var fs = require("fs")
  var Tx = require("ethereumjs-tx") // ethereumjs-tx version 1.3.7 사용. (최신 버전을 사용할 경우에는 constructor 관련 에러와 invalid sender 에러가 떠서 버전 수정하였습니다.)
  var private_key = '{{ pv_key }}'
  var node_host = `http://43.201.64.138:8547`

  var web3 = new Web3(node_host)
  var send_value_eth = 1000000

  const send_account =  '{{ }}'// send account
  const receive_account =  '{{ }}' //  receiver account
//  const privateKeyBuffer = Buffer.from(private_key, "hex")
  const privateKeyBuffer = Buffer.from(private_key.slice(2), "hex")

  function send(){
  web3.eth.getTransactionCount(send_account, (err, txCount) => { // (1)
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      to: receive_account,
      value: web3.utils.toHex(web3.utils.toWei(send_value_eth.toString(), "ether"))
    }

    console.log("@@@@@@@@@@ send_value_eth :" + send_value_eth + " @@@@@@@@@@")
    const tx = new Tx(txObject)
    tx.sign(privateKeyBuffer)

    const serializedTx = tx.serialize()
    const raw = "0x" + serializedTx.toString("hex")
  
    web3.eth  
      .sendSignedTransaction(raw) //(2)
      .once("transactionHash", hash => {
        console.info("transactionHash", "https://ropsten.etherscan.io/tx/" + hash)
      })
      .once("receipt", receipt => {
        console.info("receipt", receipt) // 터미널에 receipt 출력
      })
      .on("error", console.error) 
  })
  } 
    
  setInterval(() => send(), 2000);
