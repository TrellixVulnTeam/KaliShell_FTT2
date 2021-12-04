import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import Layout from '../components/Layout';
import HomeTile from '../components/HomeTile';
import Factory from '../components/Factory';
const abi = require('../abi/KaliDAOfactory.json');
const rinkeby = "0x6106375F8549fD1a688956F7070aa8bA3fdF51b2";

export default function Home() {
  const value = useContext(AppContext);
  const { web3, account, chainId } = value.state;
  const instance = new web3.eth.Contract(
    abi,
    rinkeby
  );
  const getPastEvents = async() => {
    let result = await instance.getPastEvents("DAOdeployed", {
      fromBlock: 0,
      toBlock: "latest",
    });
    console.log(result)
  }

  useEffect(() => {
    getPastEvents()

  }, []);

  return(
    <Layout>
      <HomeTile />
      <Factory instance={instance} />
    </Layout>
  )
}
