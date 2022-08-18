import {Flex} from "@adobe/react-spectrum"
import {GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps= async (context)=>{
  console.log('context ', context.params)
  return {props:{
    ...context.params
  }}
}

const AppPage: React.FC<{appName:string, userId:string}> = ({appName,userId})=>{
  return(
    <Flex gridArea='content' direction='column'>
      <h1>App Page</h1>
    </Flex>
  )

}

export default AppPage
