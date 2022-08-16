import {PrismaClient} from "@prisma/client"

const prisma= new PrismaClient()

export default async function handler(req,res){
  if(req.method==='GET'){
    const apps = await prisma.app.findMany({
      where:[
        {name: req.params.appName},
        {user: reg.params.userName}
      ]
    })
  }
}
