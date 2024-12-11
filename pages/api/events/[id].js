import connectDB from "../connectDB";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const { id } = req.query;

  try {
    const { db } = await connectDB();

    if (req.method === "GET") {
      const event = await db.collection("events").findOne({ _id: new ObjectId(id) });
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(event);
    } else if (req.method === "PUT") {
      const updatedEvent = req.body;
      const result = await db
        .collection("events")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updatedEvent },
          { returnDocument: "after" }
        );

      if (!result.value) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(result.value);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
