import {ActionButton, Flex} from "@adobe/react-spectrum"
import {GetServerSideProps } from "next"
import {useSession} from "next-auth/react"
import {useApps} from "../../hooks/useApps"

export const getServerSideProps: GetServerSideProps= async (context)=>{
  console.log('context ', context)
  return {props:{
    ...context.params
  }}
}

const UserPage: React.FC<{appName:string, userId:string}> = ({appName,userId})=>{
  const {data: session} = useSession()

  const apps = useApps({ownerId: session?.email })

  const createNewApp =()=>{
    fetch("/api/apps", {method:'POST',
                               body: JSON.stringify({
          name:"TestApp",
          description:"A Test app",
          public:false,
          template:"Blank"
                               }),
    headers:{
      ContentType:"application/json"
    }
                               }).then(r=>r.json()).then((r)=>console.log("createa result is ",r ))
  }

  return(
    <Flex gridArea='content' direction='column'>
      <h1>Welcome {}</h1>
      {JSON.stringify(session,null,2)}
      <ActionButton onPress={()=>createNewApp()}>Create App</ActionButton>
    </Flex>
  )

}

export default UserPage 
