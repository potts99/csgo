import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import addDays from "date-fns/addDays";
import { parseISO } from "date-fns";

// Api function that gets hit when user clicks next day
export default async function nextDay(req, res) {
  const { db } = await connectToDatabase();

  try {
    await db.collection("saves").updateOne(
      { _id: ObjectID("619d8003d937258a03fb3dc0") },
      {
        $set: {
          "gamestate.current_date": addDays(parseISO(req.body.current_date), 1),
        },
      }
    );

    res.status(200).json({ message: "Day processed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
