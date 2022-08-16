import type { NextPage } from 'next'
import {Divider, Flex, Header} from "@adobe/react-spectrum"


const Home: NextPage = () => {
  return(
    <>
    <Flex gridArea="content">
      <Flex id='templates'>
        <Header>Get Started With a Template</Header>
        <Divider size="S" />
      </Flex>
      <Flex id='templates'>
        <Header>Your Apps</Header>
      </Flex>
    </Flex>
    <Flex gridArea="toc">
      <Header>Recent popular apps</Header>
      <Flex direction='column' >
      </Flex>
    </Flex>
    </>
  )
}

export default Home
