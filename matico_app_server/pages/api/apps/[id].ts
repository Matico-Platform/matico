import {PrismaClient} from "@prisma/client"
import {unstable_getServerSession} from "next-auth"
import {authOptions} from "../auth/[...nextauth]"

const prisma= new PrismaClient()

export default async function handler(req,res){

  const session = await unstable_getServerSession(req,res, authOptions)
  const appId: string = req.query.id

  if(req.method==='GET'){
    const apps = await prisma.app.findMany({
      where:{
        id : appId
      }
    })
  }

  if(req.method==="PUT"){
    let query = {}
    let where: any  = {public : true}
  
    const appUpdate = JSON.parse(req.body)
    const {spec, public : isPublic, name,description } = appUpdate

    try{
      const updatedApp = await prisma.app.update({
        data: { spec, public: isPublic, name,description, updatedAt: new Date()},
        where:{
          id: appId 
        }
      })

      res.status(200).json(updatedApp)
    }
    catch(e:any){
      res.status(500).json({error:`Could not update app ${e.message}`})
    }
  }

  if(req.method==="DELETE"){
    try{
      const deletedApp = await prisma.app.delete({
        where:{
          id: appId 
        }
      })
      res.status(200).json(deletedApp)
    }
    catch(e:any){
      res.status(500).json({error:`Failed to delete app ${e.message}`}) 
    }
  }
}
