/**
 * Netlify will provide event and context parameters when function is invoked
 */
require('dotenv').config();
const path = require('path')
const fs = require("fs");
const { NODE_PROVIDER_API_URL, SIGNER_PRIVATE_KEY, WALLET_ADDRESS, NFT_METADATA_CONTRACT_ADDRESS} = process.env;

exports.handler = async function(event, context) {
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(NODE_PROVIDER_API_URL);
    const myAddress = WALLET_ADDRESS
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');
    const contractAbiRaw = fs.readFileSync(path.resolve(__dirname,"../contracts/MissionDAOMetaData.example.json"));
    const contractAbi = JSON.parse(contractAbiRaw.toString());
    const contractInstance = await new web3.eth.Contract(contractAbi.abi)
    const functionData = contractInstance.methods.reveal(16).encodeABI();

    const transaction = {
        'to': NFT_METADATA_CONTRACT_ADDRESS,
        'value': 0,
        'gas': 300000,
        'maxPriorityFeePerGas': 1000000108,
        'nonce': nonce,
        'data': functionData,
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, SIGNER_PRIVATE_KEY);

    try {
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
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