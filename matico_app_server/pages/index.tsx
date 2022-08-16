import type { GetServerSideProps, NextPage } from 'next'
import {Divider, Flex, Header,Grid} from "@adobe/react-spectrum"
import {getSession} from 'next-auth/react'
import {PrismaClient, App, User} from '@prisma/client'
import {AppCard} from '../components/AppCard/AppCard'
import {StandardLayout} from '../components/StandardLayout/StandardLayout'


export const getServerSideProps:GetServerSideProps =async(context)=>{
  const prisma= new PrismaClient()
  const session = await getSession(context)

  const user = session?.email ? await prisma.user.findUnique({where:{email:(session.email as string)}}) : null

  const recentApps = await prisma.app.findMany({
    where:{
      public:true,
    },
    include:{owner:true},
    orderBy:{
      createdAt:"desc"
    } 
  }) 

  const userApps = user ? await prisma.app.findMany({
    where:{
      public:true,
      ownerId: user.id
    },
    include:{owner:true},
    orderBy:{
      createdAt:"desc"
    } 
  }) 
   : null


  return{
    props:{
      recentApps:JSON.parse(JSON.stringify(recentApps)),
      userApps: JSON.parse(JSON.stringify(userApps)),
      user: JSON.parse(JSON.stringify(user))
    }
  }
}  


interface HomePageProps{
  recentApps: Array<App>,
  user?: User,
  userApps?: Array<App>
}


const Home : React.FC<HomePageProps>  = ({user,recentApps,userApps}) => {
  return(
    <StandardLayout>
      <Flex gridArea="content">
        <Flex id='templates'>
          <Header>Get Started With a Template</Header>
          <Grid rows={["1fr","1fr"]} columns={["1fr", "1fr", "1fr"]}>
            <div>
              <Header>Blank</Header>
            </div>
          </Grid>
          <Divider size="S" />
        </Flex>
        <Flex id='templates'>
          <Header>Your Apps</Header>
        </Flex>
      </Flex>
      <Flex direction='column' gridArea="toc">
        <Header>Recent popular apps</Header>
        <Flex direction='column' flex={1} >
          {recentApps.map(app=>
              <AppCard key={app.id} app={app}/>
          )}
        </Flex>
      </Flex>
    </StandardLayout>
  )
}

export default Home
