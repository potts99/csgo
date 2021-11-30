import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { parseISO } from "date-fns";

// Api function that gets hit when user clicks next day
export default async function nextDay(req, res) {
  const { db } = await connectToDatabase();

  console.log(req.body);

  try {
    const update = await db.collection("saves").updateOne(
      { _id: ObjectID("619d8003d937258a03fb3dc0") },
      {
        $set: {
          "gamestate.current_date": addDays(parseISO(req.body.current_date), 1),
        },
      }
    );

    console.log(update);

    res.status(200).json({ message: "Day processed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
