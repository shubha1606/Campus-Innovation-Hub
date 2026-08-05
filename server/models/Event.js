const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    organizer: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Hackathon",
        "Workshop",
        "Seminar",
        "Competition",
        "Other"
      ],
      default: "Other",
    },
    teamMembersCount: {
  type: Number,
  default: 1
},

mode: {
  type: String,
  enum: ["Online", "Offline"],
  default: "Offline"
},

    // NEW FIELD
    registrationUrl: {
      type: String,
      trim: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Event", eventSchema);