import { connectToDatabase } from "../../../lib/mongo";

import players from '../../../lib/db/players.json'

export default async function seedPlayers(req, res) {

    const { db } = await connectToDatabase();

    const playerList = players

    try {

      for(let k = 0; k < playerList.length; k++) {

        await db.collection('players').insertOne({
            ign: playerList[k].ign,
            age: playerList[k].age,
            role: playerList[k].role,
            language: playerList[k].language,
            morale: playerList[k].morale,
            team: playerList[k].team,
            stats: {
                rifle: playerList[k].stats.rifle,
                awp: playerList[k].stats.awp,
                leadership: playerList[k].stats.leadership,
                tactics: playerList[k].stats.tactics,
                flair: playerList[k].stats.flair,
                mentality: playerList[k].stats.mentality,
                teamwork: playerList[k].stats.teamwork,
                workrate: playerList[k].stats.workrate,
                composure: playerList[k].stats.composure,
                aggression: playerList[k].stats.aggression,
                utilty: playerList[k].stats.utilty
            }
        })
      } 

      res.status(200).json({})
        
    } catch (error) {
        console.log(error)
    }
}