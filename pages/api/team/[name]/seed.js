import { connectToDatabase } from "../../../../lib/mongo";


export default async function teamInfo(req, res) {
    const { db } = await connectToDatabase();

    const name = req.query.name
    const data = req.body

    console.log(data)
    
    try {
        const team = await db.collection('teams').insertOne({
            team_name: data.team_name,
            budget: data.budget,
            current_wage_spending: data.current_wage,
            wage_budget: data.current_wage,
            players: data.players
        })

        res.status(200).json({ team })
    } catch (error) {
        console.log(error);
    }
  }
  