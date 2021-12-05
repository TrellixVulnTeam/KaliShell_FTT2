import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../context/AppContext';
import {
  chakra,
  Button,
  HStack,
  Center,
  Text,
  Grid,
  Badge
} from "@chakra-ui/react";
import Layout from './Layout';
const abi = require("../abi/KaliDAO.json");
import ProposalRow from "./ProposalRow"
import Message from "./Message"
const proposalTypes = require("../utils/proposalTypes");

export default function Proposals() {
  const [visibleView, setVisibleView] = useState(1);
  const [proposals, setProposals] = useState(null);

  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const router = useRouter();
  const address = router.query.dao;
  var proposalArray = [];

  // get dao info
  useEffect(async() => {
    if(!address) {
      return;
    } else {
      const instance = new web3.eth.Contract(abi, address);
      const proposalCount = parseInt(
        await instance.methods.proposalCount().call()
      );
      const votingPeriod = parseInt(await instance.methods.votingPeriod().call());
      const quorum = parseInt(await instance.methods.quorum().call());
      const supermajority = parseInt(
        await instance.methods.supermajority().call()
      );

      const eventData = await instance.getPastEvents("NewProposal", {
        fromBlock: 0,
        toBlock: "latest",
      });

      const cutoff = Date.now() / 1000 - parseInt(votingPeriod);
      for (var i = 0; i < proposalCount; i++) {
          var proposal = await instance.methods.proposals(i).call();
          var proposalArrays = await instance.methods.getProposalArrays(i).call();
          if(parseInt(proposal["creationTime"]) != 0) {
            // add solidity contract id to array
            proposal["id"] = i;
            // add human-readable proposal type
            let proposalType = parseInt(proposal["proposalType"]);
            proposal["type"] = proposalTypes[proposalType];
            let expires = new Date(
              (parseInt(proposal["creationTime"]) + parseInt(votingPeriod)) * 1000
            );
            // integrate data from array getter function
            let amount = proposalArrays["amount"][0];
            proposal["amount"] = web3.utils.fromWei(amount, "ether");
            proposal["account"] = proposalArrays["account"];
            proposal["payload"] = proposalArrays["payload"];
            // format date for display
            let created = new Date(parseInt(proposal["creationTime"]) * 1000);
            proposal["expires"] = expires.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            });
            // get proposer
            for (let j = 0; j < eventData.length; j++) {
              if (eventData[j]["returnValues"]["proposal"] == i) {
                proposal["proposer"] = eventData[j]["returnValues"]["proposer"];
              }
            }
            // is voting open?
            if (parseInt(proposal["creationTime"]) > cutoff) {
              proposal["open"] = true;
              // time remaining
              proposal["timeRemaining"] = cutoff - Date.now() / 1000;
            } else {
              proposal["open"] = false;
              proposal["timeRemaining"] = 0;
            } // end open vs. closed
            proposalArray.push(proposal);
          } // end live proposals
        } // end for loop
        setProposals(proposalArray);
      }
  });

  const vote = async () => {
      event.preventDefault();

      value.setLoading(true);

      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      const { dao, id, approval } = array;

      const instance = new web3.eth.Contract(abi, dao);

      const accounts = await web3.eth.getAccounts();
      // * first, see if they already voted * //
      const voted = await instance.methods.voted(id, accounts[0]).call();
      if (voted == true) {
        alert("You already voted");
      } else {
        try {
          let result = await instance.methods
            .vote(id, parseInt(approval))
            .send({ from: accounts[0] });

          Router.push({
            pathname: "/daos/[dao]",
            query: { dao: dao },
          });

        } catch (e) {}

      }
      value.setLoading(false);
    };

    const process = async () => {
      event.preventDefault();
      value.setLoading(true);
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      const { dao, id } = array;

      const instance = new web3.eth.Contract(abi, dao);

      try {
        const accounts = await web3.eth.getAccounts();
        // * first, see if they already voted * //
        let result = await instance.methods
          .processProposal(id)
          .send({ from: accounts[0] });

        Router.push({
          pathname: "/daos/[dao]",
          query: { dao: dao },
        });
      } catch (e) {
        alert(e);
      }

      value.setLoading(false);
    };

  return(
    <>

    {proposals==null ? <>Loading...</> :
      <>
      {proposals.length == 0 ? (
        <Message>Awaiting proposals</Message>
        ) : (
        <Grid templateColumns="repeat(1, 1fr)" gap={1}>
          {proposals.map((p, index) => (
            <ProposalRow key={index} p={p} address={address} vote={vote} process={process}>
              <Text fontSize="md">{p['description']}</Text>
            </ProposalRow>
          ))}
        </Grid>
        )
        }
      </>
    }

    </>
  )
}
