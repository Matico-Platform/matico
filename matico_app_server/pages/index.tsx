import type { GetServerSideProps, NextPage } from 'next'
import {Divider, Flex, Header,Grid, View, ActionButton, Text,Heading} from "@adobe/react-spectrum"
import {getSession} from 'next-auth/react'
import {PrismaClient, App, User} from '@prisma/client'
import {AppCard} from '../components/AppCard/AppCard'
import {StandardLayout} from '../components/StandardLayout/StandardLayout'
import {createAppFromTemplate} from '../utils/api'
import {useRouter} from "next/router"

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
  const router = useRouter()

  const createNewApp = (template:string)=>{
    createAppFromTemplate(template).then(
                           app => router.push(`/apps/edit/${app.id}`) 
    )
  }
  return(
    <StandardLayout>
      <Flex gridArea="content">
        <Flex id='templates' direction='column' gap="size-500" width="100%" >
          <Heading>Get Started With a Template</Heading>
          <Grid rows={["1fr","1fr"]} columns={["1fr", "1fr", "1fr"]} columnGap ="size-500" flex={1} maxHeight="450px">
            <ActionButton width="200px" height="200px" onPress={()=>createNewApp("Blank")}>
                <View>
                  <Text>Blank</Text>
                </View>
            </ActionButton>
            <ActionButton width="200px" height="200px" onPress={()=>createNewApp("BigMap")}>
                <View>
                  <Text>Big Map</Text>
                </View>
            </ActionButton>
            <ActionButton width="200px" height="200px" onPress={()=>createNewApp("MapWithSideBar")}>
                <View>
                  <Text>Map With Sidebar</Text>
                </View>
            </ActionButton>
            <ActionButton width="200px" height="200px" onPress={()=>createNewApp("Scrollytelling")}>
                <View>
                  <Text>Scrollytelling</Text>
                </View>
            </ActionButton>
          </Grid>
          <Divider size="S" />
        </Flex>
        {user && userApps && 
        <Flex id='templates' direction='column'>
          <Header>Your Apps</Header>
          <Grid rows={["1fr","1fr"]} columns={["1fr", "1fr", "1fr"]} flex={1}>
            {userApps.map(userApp=>
              <AppCard key={userApp.id} app={userApp}/>
            )}
          </Grid>
        </Flex>
        }
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
