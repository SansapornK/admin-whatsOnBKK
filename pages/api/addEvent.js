// pages/api/addEvent.js
import fs from "fs";
import path from "path";
import { Formidable } from 'formidable';
import connectDB from "../api/connectDB";  // Import your MongoDB connection logic

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

      // Extracting fields
      const { name, description, type, date, time, attendees } = fields;

      const location = {
        area: fields["location[area]"],
        address: fields["location[address]"],
        coordinates: {
          lat: parseFloat(fields["location[coordinates][lat]"]),
          lng: parseFloat(fields["location[coordinates][lng]"]),
        },
      };

      const images = files["images[]"] ? (Array.isArray(files["images[]"]) ? files["images[]"] : [files["images[]"]]) : [];

      try {
        const imagePaths = await Promise.all(
          images.map(async (image) => {
            const filePath = path.join("public", "uploads", image.originalFilename);
            await fs.promises.rename(image.filepath, filePath); // Move image to public folder
            return `/uploads/${image.originalFilename}`; // Store the image path
          })
        );

        // Prepare event data for insertion into MongoDB
        const eventData = {
          name: name[0],  // Use first item of the array
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
          date: new Date(date),  // Use the date directly (already correct)
          time: time[0],  // Use first item of the time array
          images: imagePaths,  // Use the image paths (should already be an array)
        };


        // Connect to MongoDB
        const client = await connectDB();
        const db = client.db('whatsonbkk');  // Use your database name
        const eventsCollection = db.collection('events');  // Collection where events are stored

        // Insert the event into the database
        const result = await eventsCollection.insertOne(eventData);

        // Respond with success
        return res.status(200).json({ message: "Event created successfully!", eventId: result.insertedId });
      } catch (fileErr) {
        console.error("Error moving files:", fileErr);
        return res.status(500).json({ error: "Error moving uploaded files." });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" }); // Handle non-POST requests
  }
};

export default handler;
