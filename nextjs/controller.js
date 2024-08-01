import User from '@/models/user'
import dbConnect from '@/utils/mongo.js'
import { userAgentFromString } from 'next/server';

export const config = {
  api: {
    bodyParser: true,
  }
}

export default async function handler(req, res) {
  const { method } = req;
  dbConnect();

  if (method === 'POST') {
    try {

        const {ids} = req.body;
        const user = await User.find({discordId:{$in:ids}});
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        return res.status(200).json({message:'data received successfully',data:user})
   
    } catch (err) {
      res.json(err);
    }
  }
}
