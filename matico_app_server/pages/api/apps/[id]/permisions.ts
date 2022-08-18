import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { setAppAccess, userHasManage } from "../../../../utils/db";
import { userFromSession } from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);
  let appId= req.query.id;
  let user = await userFromSession(session, prisma);
  let app = prisma.app.findUnique({
    where: { id: appId },
    include: {owner:true, colaborators:true} 
  });

  if(req.method==="GET"){
    res.status(200).json(app.colaborators)
  }

  if(req.method==="POST"){
    let {userId,permisions} = JSON.parse(req.body)


    if (!await userHasManage( app, user)) {
      res.status(401).json({error:"You dont have permision to do that"})
    }
    
    const result = setAppAccess(app,userId, permisions)
    res.status(200).json(result)
  }

}
