require("dotenv").config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;

const app = express();

const PORT="3000";
// Middleware to parse JSON request bodies
app.use(bodyParser.json());
//https://www.quicknode.com/docs/ethereum/qn_fetchNFTs_v2
//Returns aggregated data on NFTs for a given wallet. 

app.post('/api/fetch', async (req, res) => {
  try{
    let { page=1,perPage=10,wallet,contracts } = req.body;
    let params=[{
      wallet:wallet,
      page: page,
      perPage: perPage
    }];
    if(contracts || process.env.CONTRACTS){
      params[0].contracts=contracts || JSON.parse(process.env.CONTRACTS);
    }
    const response = await axios.post(
        QUICKNODE_RPC_URL, 
        {
          id: 67,
          jsonrpc: '2.0',
          method: 'qn_fetchNFTs',
          params: params
        }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      res.status(200).json(response.data);
  }
  catch (error) {
    console.error('Error occurred:', error);
    // Send a generic error response or customize based on the error
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});
//https://www.quicknode.com/docs/ethereum/qn_fetchNFTs_v2
//Returns aggregated data on NFTs within a given collection.
app.post('/api/infoCollection', async (req, res) => {
   try{
    let { page=1,perPage=10,collection,tokens } = req.body;
    let params=[{
      collection:collection|| process.env.COLLECTION,
      page: page,
      perPage: perPage
    }];
    if(tokens || process.env.TOKENS){
      params[0].tokens=tokens || JSON.parse(process.env.TOKENS);
    }
    console.log(params);
      const response = await axios.post(
        QUICKNODE_RPC_URL, 
        {
          id: 67,
          jsonrpc: '2.0',
          method: 'qn_fetchNFTsByCollection',
          params: params
        }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    
      res.status(200).json(response.data);      
    }
    
    catch (error) {
        console.error('Error occurred:', error);
        // Send a generic error response or customize based on the error
        res.status(500).json({ message: 'An error occurred while fetching data' });
      }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});