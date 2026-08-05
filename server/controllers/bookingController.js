const Booking = require("../models/Booking");
const { createNotification } = require("./notificationController");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { mentor, date, time, topic, meetingMode } = req.body;

    if (!mentor || !date || !topic || !meetingMode) {
      return res.status(400).json({ message: 'mentor, date, topic and meetingMode are required' });
    }

    const normalizedMode = String(meetingMode).toLowerCase();
    if (!['online', 'offline'].includes(normalizedMode)) {
      return res.status(400).json({ message: 'meetingMode must be online or offline' });
    }

    const booking = await Booking.create({
      mentor,
      student: req.user._id,
      date,
      time,
      topic,
      meetingMode: normalizedMode,
    });

    await createNotification(
      {
        userId: mentor,
        userModel: "Mentor",
        type: "booking",
        title: "New mentorship request",
        message: `${req.user.name} requested a booking on ${date}`,
        link: "/mentor/requests",
      },
      req
    );

    res.status(201).json({
      message: "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Bookings
const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mentorId) filter.mentor = req.query.mentorId;
    if (req.query.studentId) filter.student = req.query.studentId;

    const bookings = await Booking.find(filter)
      .populate("mentor", "name email expertise")
      .populate("student", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("mentor", "name email expertise")
      .populate("student", "name email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }


    const isStudent = booking.student.toString() === (req.user?._id || req.user?.id)?.toString();
    const isMentor = booking.mentor.toString() === (req.user?._id || req.user?.id)?.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isStudent && !isMentor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Normalize status values (accept case-insensitive 'approved'/'rejected')
    if (req.body && typeof req.body.status === 'string') {
      const map = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        completed: 'Completed',
      };
      const norm = map[req.body.status.toLowerCase()] || req.body.status;
      req.body.status = norm;
    }

    if (!isMentor && !isAdmin) {
      delete req.body.mentorNote;
    }

    const oldStatus = booking.status;
    Object.assign(booking, req.body);
    await booking.save();

    if (oldStatus !== booking.status) {
      await createNotification(
        {
          userId: booking.student,
          userModel: "User",
          type: "booking",
          title: `Booking ${booking.status}`,
          message: `Your mentorship request has been ${booking.status.toLowerCase()}.`,
          link: "/student/bookings",
        },
        req
      );
    }

    res.status(200).json({
      message: "Booking Updated Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.student.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();

    res.status(200).json({
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};