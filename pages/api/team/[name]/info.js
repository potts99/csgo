import { connectToDatabase } from "../../../../lib/mongo";


export default async function teamInfo(req, res) {
    const { db } = await connectToDatabase();

    const name = req.query.name
    
    try {
        const team = await db.collection('teams').findOne({
            team_name: name
        })

        res.status(200).json({ team })
    } catch (error) {
        console.log(error);
    }
  }
  