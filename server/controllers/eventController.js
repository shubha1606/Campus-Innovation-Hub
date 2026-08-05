const Event = require("../models/Event");


// Create Event
const createEvent = async (req, res) => {
  try {

    const {
      title,
      description,
      organizer,
      date,
      location,
      category,
      registrationUrl
    } = req.body;


    const event = await Event.create({
      title,
      description,
      organizer,
      date,
      location,
      category,
      registrationUrl,
      createdBy: req.user._id
    });


    res.status(201).json({
      message: "Event Created Successfully",
      event
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




// Get All Events
const getEvents = async (req, res) => {
  try {

    const events = await Event.find()
      .populate("createdBy", "name email college")
      .populate("participants", "name email college");


    res.status(200).json(events);


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




// Get Single Event
const getEventById = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email college")
      .populate("participants", "name email college");


    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }


    res.status(200).json(event);


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




// Student Join Event
const joinEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);


    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }


    // Check if already joined
    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already joined this event"
      });
    }


    event.participants.push(req.user._id);

    await event.save();


    res.status(200).json({
      message: "Joined Event Successfully",
      participantCount: event.participants.length
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




// Update Event
const updateEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);


    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }


    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }


    Object.assign(event, req.body);

    await event.save();


    res.status(200).json({
      message: "Event Updated Successfully",
      event
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




// Delete Event
const deleteEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);


    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }


    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }


    await event.deleteOne();


    res.status(200).json({
      message: "Event Deleted Successfully"
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};




module.exports = {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  updateEvent,
  deleteEvent
};