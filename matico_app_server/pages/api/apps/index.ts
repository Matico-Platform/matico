import {PrismaClient} from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import {Templates} from '../../../templates'
import { unstable_getServerSession } from "next-auth"
import {authOptions} from "../auth/[...nextauth]"

const prisma= new PrismaClient()

export default async function handler(req: NextApiRequest,res: NextApiResponse){

  const session = await unstable_getServerSession(req,res, authOptions)

  if(req.method==="GET"){
    let query = {}
    let where: any  = {public : true}

    let orderBy = {
      updatedAt: "asc"
    }

    if(req.query.orderBy){
      orderBy = {[req.query.orderBy as string]: "asc", ...orderBy} 
    }

    if(req.query.ownerId){
        where.ownerId = req.query.ownerId
    } 

    const apps = await  prisma.app.findMany({
      where, 
      orderBy
    })

    res.status(200).json(apps)
    return
  }


  if(req.method==='POST'){
      if (!session ) {
        res.status(401).json({"error": "Not Logged In"})
        return
      }

    
      const user = await prisma.user.findUnique({where:{
        email: session?.user?.email 
      }})
    
      if (!user) {
        res.status(401).json({"error": "Failed to find User"})
        return
      }

      const appDetails = JSON.parse(req.body)

      console.log("app details are ", JSON.stringify(appDetails,null,2))
      console.log("Templates ", Object.keys(Templates))
      if(!Object.keys(Templates).includes(appDetails.template)){
        res.status(401).json({"error": "Unknown tempalte type"})
        return
      }

      const app = await prisma.app.create({
        data:{
          name: appDetails.name as string,
          description: appDetails.description as string,
          public :appDetails.public as boolean,
          spec: Templates[appDetails.template],
          ownerId: user.id
        },
        include:{owner:true}
      })
      res.status(201).json(app)
    }
  }

