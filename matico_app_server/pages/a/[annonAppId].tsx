import {Flex} from "@adobe/react-spectrum";
import {PrismaClient, App} from "@prisma/client";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import dynamic from "next/dynamic";


const prisma= new PrismaClient()

export const getServerSideProps:GetServerSideProps =async(context)=>{
  const session = await getSession(context)
  const app = await prisma.app.findUnique({where:{id:context.query.annonAppId}}) 
  return{
    props:{
      app:JSON.parse(JSON.stringify(app))
    }
  }
}  

interface AppPresentPageProps{
  app:App
}

const AppPresentPage : React.FC<AppPresentPageProps>= ({app})=>{
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );
  return(
    <Flex>
      <MaticoApp 
        spec={app.spec}
        basename={`/a/${app.id}`}
        editActive={false} />
    </Flex>
  ) 
}

export default AppPresentPage 
