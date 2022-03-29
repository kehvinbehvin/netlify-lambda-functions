/**
 * Netlify will provide event and context parameters when function is invoked
 */
require('dotenv').config();
const path = require('path')
const fs = require("fs");
const { NODE_PROVIDER_API_URL, SIGNER_PRIVATE_KEY, WALLET_ADDRESS, NFT_METADATA_CONTRACT_ADDRESS} = process.env;

exports.handler = async function(event, context) {
    console.log("NODE_PROVIDER_API_URL",NODE_PROVIDER_API_URL)
    console.log("SIGNER_PRIVATE_KEY",SIGNER_PRIVATE_KEY)
    console.log("WALLET_ADDRESS",WALLET_ADDRESS)
    console.log("NFT_METADATA_CONTRACT_ADDRESS",NFT_METADATA_CONTRACT_ADDRESS)
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(NODE_PROVIDER_API_URL);
    console.log("web3 initiated")
    const myAddress = WALLET_ADDRESS
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');
    console.log("nonce retrieved")
    const contractAbiRaw = fs.readFileSync(path.resolve(__dirname,"../contracts/MissionDAOMetaData.example.json"));
    console.log("contract abi retrieved")
    const contractAbi = JSON.parse(contractAbiRaw.toString());
    console.log("contract abi parsed")
    const contractInstance = await new web3.eth.Contract(contractAbi.abi)
    console.log("contract instantiated")
    const functionData = contractInstance.methods.reveal(16).encodeABI();
    console.log("function encoded")

    const transaction = {
        'to': NFT_METADATA_CONTRACT_ADDRESS,
        'value': 0,
        'gas': 300000,
        'maxPriorityFeePerGas': 1000000108,
        'nonce': nonce,
        'data': functionData,
    };
    console.log("transaction created:", transaction)

    const signedTx = await web3.eth.accounts.signTransaction(transaction, SIGNER_PRIVATE_KEY);
    console.log("transaction signed", signedTx)
    try {
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("transaction sent and is successful")
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Success!!"})
        }
    } catch(error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Error!!"})
        }
    }
}