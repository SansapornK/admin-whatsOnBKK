// /pages/api/deleteEvent.js
import { ObjectId } from "mongodb";
import connectDB from "./connectDB";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query; // Correctly match the query parameter name

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    try {
      const { db } = await connectDB();
      const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Event deleted successfully." });
      } else {
        res.status(404).json({ message: "Event not found." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
