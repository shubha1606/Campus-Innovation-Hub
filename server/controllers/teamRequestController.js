const TeamRequest = require("../models/TeamRequest");
const { createNotification } = require("./notificationController");


// Create Team Request
const createTeamRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can create team requests",
      });
    }

    const {
      receiver,
      project,
      message,
    } = req.body;


    const request = await TeamRequest.create({
      sender: req.user._id,
      receiver,
      project,
      message,
    });


    await createNotification(
      {
        userId: receiver,
        userModel: "User",
        type: "teamRequest",
        title: "New Team Request",
        message: `${req.user.name} sent you a team request.`,
        link: "/student/team-requests",
      },
      req
    );


    res.status(201).json({
      message: "Team Request Sent Successfully",
      request,
    });


  } catch (error) {

    console.error("Create Team Request Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};




// Get Team Requests (Sent + Received)
const getTeamRequests = async (req, res) => {

  try {

    if (req.user.role !== "student") {
      return res.status(200).json([]);
    }


    const requests = await TeamRequest.find({
      $or: [
        {
          sender: req.user._id
        },
        {
          receiver: req.user._id
        }
      ]
    })
      .populate(
        "sender",
        "name email profileImage"
      )
      .populate(
        "receiver",
        "name email profileImage"
      )
      .populate(
        "project",
        "title"
      )
      .sort({
        createdAt: -1
      });



    res.status(200).json(requests);



  } catch (error) {

    console.error("Get Team Requests Error:", error);

    res.status(500).json({
      message: error.message,
    });

  }

};






// Accept / Reject Team Request
const updateTeamRequest = async (req, res) => {

  try {


    const request = await TeamRequest.findById(req.params.id);



    if (!request) {

      return res.status(404).json({
        message: "Team Request not found",
      });

    }



    // Only receiver can accept/reject
    if (
      request.receiver.toString() !== req.user._id.toString()
      &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message: "Only receiver can update this request",
      });

    }



    const { status } = req.body;



    if (
      !["Accepted", "Rejected"].includes(status)
    ) {

      return res.status(400).json({
        message: "Invalid status. Use Accepted or Rejected",
      });

    }




    request.status = status;

    await request.save();





    // Notify sender
    await createNotification(
      {
        userId: request.sender,
        userModel: "User",
        type: "teamRequest",
        title: `Team request ${status}`,
        message: `Your team request was ${status.toLowerCase()}.`,
        link: "/student/team-requests",
      },
      req
    );





    res.status(200).json({

      message: `Team Request ${status}`,

      request,

    });





  } catch (error) {


    console.error("Update Team Request Error:", error);


    res.status(500).json({

      message: error.message,

    });


  }

};





module.exports = {

  createTeamRequest,

  getTeamRequests,

  updateTeamRequest,

};