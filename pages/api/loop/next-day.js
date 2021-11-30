import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";

// Api function that gets hit when user clicks next day
export default async function nextDay(req, res) {
  const { db } = await connectToDatabase();

  try {

    const update = await db.collection("saves").updateOne(
      { _id: ObjectID("619d8003d937258a03fb3dc0") },
      {
        $set: {
          "gamestate.current_date": "2nd Jan",
        },
      }
    );

    console.log(update)

    res.status(200).json({ message: "Day processed" });
  } catch (error) {
      console.log(error)
      res.status(500).json({ error })
  }
}
