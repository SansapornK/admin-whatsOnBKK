import { ObjectId } from 'mongodb';
import connectDB from '../connectDB'; // Ensure this points to the correct file

export default async function handler(req, res) {
  const { id } = req.query; // Extract the event ID from the URL

  // Ensure the ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const { db } = await connectDB(); // Connect to the database
    const eventsCollection = db.collection('events');

    if (req.method === 'GET') {
      // Fetch the event by ID
      const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(event); // Return the event data for editing
    } else if (req.method === 'PUT') {
      // Destructure and validate incoming fields
      const {
        name,
        description,
        type,
        dateStart,
        dateEnd,
        timeStart,
        timeEnd,
        isPublic,
        createdBy,
        location,
        attendees,
        images,
      } = req.body;

      // Prepare the updated event data
      const updatedEventData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(type && { type }),
        ...(dateStart && { dateStart: new Date(dateStart) }),
        ...(dateEnd && { dateEnd: new Date(dateEnd) }),
        ...(timeStart && { timeStart }),
        ...(timeEnd && { timeEnd }),
        ...(typeof isPublic !== 'undefined' && { isPublic: isPublic === 'true' }),
        ...(createdBy && { createdBy: new ObjectId(createdBy) }),
        ...(location && {
          location: {
            ...location,
            coordinates: location.coordinates
              ? {
                  lat: parseFloat(location.coordinates.lat),
                  lng: parseFloat(location.coordinates.lng),
                }
              : {},
          },
        }),
        ...(attendees && { attendees: attendees.map((id) => new ObjectId(id)) }),
        ...(images && { images }),
        updatedAt: new Date(),
      };

      // Update the event in the database
      const result = await eventsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedEventData }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Event not found or no changes made' });
      }

      res.status(200).json({ message: 'Event updated successfully', eventId: id });
    } else {
      // Handle unsupported methods
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
}
