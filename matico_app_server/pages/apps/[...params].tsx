import {Flex, View} from "@adobe/react-spectrum";
import {PrismaClient, App} from "@prisma/client";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import dynamic from "next/dynamic";
import {userFromSession} from "../../utils/db";


export const getServerSideProps:GetServerSideProps =async(context)=>{
  const prisma= new PrismaClient()
  const session = await getSession(context)
  const user = await userFromSession(session, prisma)
  const params = context.query.params

  const app = await prisma.app.findUnique({
    where:{
      id: params? params[0] : undefined 
    },
    include:{owner:true}
  }) 

  if(!app) return {props:{ app: null, error:"Failed to find app"}}

  if(app.owner.id !== user?.id  && app.public === false) return { props:{app:null, error:"Unauthorized to view this app"}}

  return{
    props:{
      app:JSON.parse(JSON.stringify(app))
    }
  }
}  

interface AppPresentPageProps{
  app?:App,
  error?: string
}

const AppPresentPage : React.FC<AppPresentPageProps>= ({app,error})=>{
  const MaticoApp= dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );


  if(error){
    return(
      <Flex height="100%" gridArea="content">
        <h2>{error}</h2>
      </Flex>
    )
  }

  return(
    <Flex width="100vw" height="100vh" >
      {app &&
        <MaticoApp
          spec={app.spec}
          basename={`/apps/${app.id}`}
          editActive={false}
        />
      }
    </Flex>

  ) 
}

export default AppPresentPage 
