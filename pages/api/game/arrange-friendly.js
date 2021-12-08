import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import formatISO from 'date-fns/formatISO'
import { parseISO } from "date-fns";


// GET DATE, OPP TEAM NAME
// Insert details into fixture array

// Function to create friendlys between two teams
export default async function arrangeFriendly(req, res) {
  const { db } = await connectToDatabase();

  const { opponent, date } = req.body;

  try {
    const test = await db.collection("saves").updateOne(
      {
        _id: ObjectID("619d8003d937258a03fb3dc0"),
      },
      {
        $push: {
          fixtures: {
            date: new Date(formatISO(parseISO(date))),
            opponent: opponent,
            winner: "",
            loser: "",
            m_score: "",
            o_score: "",
            completed: false,
          },
        },
      }
    );

    res.status(200).json({ success: true, test });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
