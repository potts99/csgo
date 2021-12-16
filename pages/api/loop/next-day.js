import { connectToDatabase } from "../../../lib/mongo";
import addDays from "date-fns/addDays";
import { parseISO } from "date-fns";
import { getSession } from "next-auth/react";

// Api function that gets hit when user clicks next day
export default async function nextDay(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  try {
    if (session.user.email) {
      await db.collection("saves").updateOne(
        { user: session.user.email },
        {
          $set: {
            "gamestate.current_date": addDays(
              parseISO(req.body.current_date),
              1
            ),
          },
        }
      );
      res.status(200).json({ message: "Day processed" });
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
