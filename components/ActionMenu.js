import {
  Flex,
  Button
} from "@chakra-ui/react";

export default function ActionMenu(props) {
  return(
    <Flex padding={5} width="100%">
        <Button onClick={() => props.setVisible(1)}>Proposals</Button>
        <Button onClick={() => props.setVisible(2)}>New Proposal</Button>
    </Flex>
  )
}
