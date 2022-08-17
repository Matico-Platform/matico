import {Divider, Flex} from "@adobe/react-spectrum";
import {PrismaClient, App} from "@prisma/client";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import dynamic from "next/dynamic";
import {useMemo} from "react";
import {AppOptionsBar} from "../../../components/AppOptionsBar/AppOptionsBar";
import {useApp} from "../../../hooks/useApp";


const prisma= new PrismaClient()

export const getServerSideProps:GetServerSideProps =async(context)=>{
  const session = await getSession(context)
  const user = session?.user?.email ? await prisma.user.findUnique({where:{email:(session?.user?.email as string)}}) : null
  const params = context.query.params

  const app = await prisma.app.findUnique({
    where:{
      id: params ? params[0] : undefined  
    },
    include:{owner:true}
  }) 

  if(!app) return {props:{ app: null, error:"Failed to find app"}}

  if(app.owner.id !== user?.id  && app.public === false) return { props:{app:null, error:"Unauthorized to view this app"}}

  return{
    props:{
      initialApp:JSON.parse(JSON.stringify(app))
    }
  }
}  

interface AppPresentPageProps{
  initialApp?:App,
  error?: string
}

const AppPresentPage : React.FC<AppPresentPageProps>= ({initialApp,error})=>{
  console.log("inital app is ",initialApp)
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );

  const {app, updateApp,setPublic}= useApp(initialApp?.id, initialApp)

  const onUpdateSpec= (spec: App)=>{

    if(!spec){return }

    const update={
          name: spec.name,
          description: spec.description,
          spec: spec,
    }

    updateApp(update)
      .catch(e=>{console.log("Failed to udpate app", e.error)})
  }

  const editor = useMemo(()=>

      <MaticoApp 
                onSpecChange={(spec: any) => {
                  onUpdateSpec(spec);
                }}
                spec={initialApp.spec}
                basename={`/apps/edit/${initialApp.id}`}
                editActive={true} />
  ,[initialApp])



  if(error){
    return(
      <Flex height="100%" gridArea="content">
        <h2>{error}</h2>
      </Flex>
    )
  }

  return(
    <Flex direction='column' height='100vh'>
      <AppOptionsBar app={app} onPublicUpdate={setPublic} />
      <Divider size="S"/>

      <Flex flex={1}>
        {editor}
      </Flex>
    </Flex>
  ) 
}


export default AppPresentPage
