import { PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import { unstable_getServerSession } from "next-auth";
import { setAppAccess, userHasManage } from "../../../../utils/db";
import { userFromSession } from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);
  let user = await userFromSession(session, prisma);

  let appId  = req.query.id

  let app = prisma.app.findUnique({
    where: { id:appId },
    include: {owner:true, colaborators:true} 
  });

  if(req.method==="GET"){
    let id = req.query.id
    if( app.owner.id=== user.id){ return {view:true, edit:true, manage:true }}

  }

  if(req.method==="POST"){
    let id= req.query.id;
    let {userId,permisions} = JSON.parse(req.body)


    if (!await userHasManage(app, user)) {
      res.status(401).json({error:"You dont have permision to do that"})
    }
    
    const result = setAppAccess(app,userId, permisions)
    res.status(200).json(result)
  }

}
