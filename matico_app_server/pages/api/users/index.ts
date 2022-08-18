import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export default async function handler(req:NextApiRequest, res: NextApiResponse){


  if(req.method==='GET'){
    let query: any ={
      where:{}
    }
    if(req.query.hasOwnProperty("take")){
      query.take = parseInt(req.query.take as string)
    } 
    if(req.query.hasOwnProperty("search")){
      query.where.name = {search: req.query.search} 
    } 

    let users = await prisma.user.findMany(query);
    res.status(200).json(users)
  }
}
