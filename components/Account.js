import { useContext } from 'react';
import AppContext from '../context/AppContext';
import {
  Button
} from "@chakra-ui/react";

export default function Account() {
  const value = useContext(AppContext);
  const { account } = value.state;
  return(
    <Button
      bgGradient="linear(to-br, kali.600, kali.700)"
      size="md"
      variant="ghost"
      color="white"
      mr={2}
      border={0}

    >
      {account == null ? "Connect Wallet" : account}
    </Button>
  )
}
