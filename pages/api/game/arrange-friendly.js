import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import formatISO from "date-fns/formatISO";
import { parseISO } from "date-fns";
import { getSession } from "next-auth/react";

// GET DATE, OPP TEAM NAME
// Insert details into fixture array

// Function to create friendlys between two teams
export default async function arrangeFriendly(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  const { opponent, date } = req.body;

  try {
    if (session.user.email) {
      const test = await db.collection("saves").updateOne(
        {
          user: session.user.email,
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
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
