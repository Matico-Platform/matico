import {Flex} from "@adobe/react-spectrum";
import {PrismaClient, App} from "@prisma/client";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import dynamic from "next/dynamic";
import {updateApp} from "../../../utils/api";


const prisma= new PrismaClient()

export const getServerSideProps:GetServerSideProps =async(context)=>{
  const session = await getSession(context)

  const user = session?.user?.email ? await prisma.user.findUnique({where:{email:(session?.user?.email as string)}}) : null

  const app = await prisma.app.findUnique({
    where:{
      id:context.query.appId as string  
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
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );

  const onUpdateApp = (spec: App)=>{

    if(!spec){return }

    const update={
          ...app,
          name: spec.name,
          description: spec.description,
          spec: spec,
    }

    updateApp(update)
    .catch(e=>{console.log("Failed to udpate app", e.error)})
  }

  if(error){
    return(
      <Flex height="100%" gridArea="content">
        <h2>{error}</h2>
      </Flex>
    )
  }

  return(
    <Flex height="100vh">
      {app &&
        <MaticoApp 
          onSpecChange={(spec: any) => {
            onUpdateApp(spec);
          }}
          spec={app.spec}
          basename={`/apps/edit/${app.id}`}
          editActive={true} />
      }
    </Flex>

  ) 
}

export default AppPresentPage 
