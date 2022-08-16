import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export default async function handler(req:NextApiRequest, res: NextApiResponse){
  console.log("req is ",req.method)
  if(req.method==='GET'){
    let users = await prisma.user.findMany();
    res.status(200).json(users)
  }
}
