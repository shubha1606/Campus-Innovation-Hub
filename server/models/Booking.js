const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    meetingMode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    mentorNote: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('validate', function () {
  if (this.status === 'Approved') {
    if (this.meetingMode === 'online' && !this.meetingLink) {
      this.invalidate('meetingLink', 'meetingLink is required for online approved bookings');
    }

    if (this.meetingMode === 'offline' && !this.location) {
      this.invalidate('location', 'location is required for offline approved bookings');
    }
  }
});

module.exports = mongoose.model("Booking", bookingSchema);