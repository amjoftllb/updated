// src/app/api/data/route.js
import dbConnect from "@/config/dbConnect";
import User from "@/models/User";


export async function POST(request) {
    try {
        dbConnect()
      const { userId } = await request.json();

      const userid = await User.findOne({ userId })

      return new Response(JSON.stringify({ message: 'Data received successfully', data: userid._id  }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error processing request', error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  