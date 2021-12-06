import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import format from "date-fns/format";
import { nextDay } from "date-fns";

// GET DATE, OPP TEAM NAME
// Insert details into fixture array

// Function to create friendlys between two teams
export default async function arrangeFriendly(req, res) {

    const { db } = await connectToDatabase();

    try {

    const test = await db.collection('saves').updateOne({
        _id: ObjectID('619d8003d937258a03fb3dc0')
    }, {
        $push: {
            fixtures: {
                date: new Date(),
                opponent: 'Team Liquid',
                winner: '',
                loser: '',
                m_score: '',
                o_score: '',
                completed: false
            }
        }
    })
        
    res.status(200).json({ test })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}