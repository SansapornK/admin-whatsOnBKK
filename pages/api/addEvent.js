// pages/api/addEvent.js
import fs from "fs";
import path from "path";
import { Formidable } from "formidable";
import connectDB from "../api/connectDB";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for this route
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const form = new Formidable();
    form.keepExtensions = true; // Keep file extensions

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form data." });
      }

      const { name, description, type, dateStart, dateEnd, timeStart, timeEnd } = fields;
      
      const location = {
        area: fields["location[area]"],
        address: fields["location[address]"],
        coordinates: {
          lat: parseFloat(fields["location[coordinates][lat]"]),
          lng: parseFloat(fields["location[coordinates][lng]"]),
        },
      };

      const images = files["images[]"]
        ? Array.isArray(files["images[]"])
          ? files["images[]"]
          : [files["images[]"]]
        : [];

      try {
        const imagePaths = await Promise.all(
          images.map(async (image) => {
            const filePath = path.join("public", "uploads", image.originalFilename);
            await fs.promises.rename(image.filepath, filePath);
            return `/uploads/${image.originalFilename}`;
          })
        );

        const eventData = {
          name: name[0],
          description: description[0],  // Use first item of the array
          type: type[0],  // Use first item of the array
          location: {
            area: location.area[0],  // Use first item of the area array
            address: location.address[0],  // Use first item of the address array
            coordinates: {
              lat: location.coordinates.lat,  // Directly use lat value
              lng: location.coordinates.lng,  // Directly use lng value
            }
          },
          dateStart: new Date(dateStart),   
          dateEnd: new Date(dateEnd), 
          timeStart: timeStart[0],  
          timeEnd: timeEnd[0],
          images: imagePaths,  // Use the image paths (should already be an array)
        };

        // Use the updated connectDB
        const { db } = await connectDB(); // Destructure db
        const eventsCollection = db.collection("events");

        const result = await eventsCollection.insertOne(eventData);

        res.status(200).json({ message: "Event created successfully!", eventId: result.insertedId });
      } catch (error) {
        console.error("Error processing the event:", error);
        res.status(500).json({ error: "Error processing the event." });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
