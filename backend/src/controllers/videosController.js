import Video from "../models/Video.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, subject, classNumber, description, standards, url } = req.body;

    // Validate required fields
    if (!title || !subject || !classNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, subject, classNumber"
      });
    }

    // Either URL or file should be provided
    if (!url && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a video URL or upload a file"
      });
    }

    const video = new Video({
      title,
      subject,
      classNumber,
      description,
      standards: standards ? (Array.isArray(standards) ? standards : [standards]) : [classNumber],
      schoolId: req.user.schoolId,
      url: url || null,
      file: req.file ? `videos/${req.file.filename}` : null,
      createdBy: req.user.id
    });
    await video.save();

    res.status(201).json({ success: true, message: "Video uploaded successfully", data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ schoolId: req.user.schoolId });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

export const getVideosByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;

    const videos = await Video.find({
      classNumber,
      schoolId: req.user.schoolId
    });

    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos for class",
      error: err.message
    });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    let schoolIdToUse = req.user.schoolId;

    if (req.user.role === "student") {
      // If student is premium and requests another school's materials
      if (req.query.schoolId && req.query.schoolId !== req.user.schoolId.toString()) {
        if (req.user.isPremium) {
          schoolIdToUse = req.query.schoolId;
        } else {
          return res.status(403).json({ success: false, message: "Upgrade to premium to access materials of other institutions." });
        }
      }
    }

    const filter = { schoolId: schoolIdToUse };
    
    // If teacher, only fetch their own uploaded videos
    if (req.user.role === "teacher") {
      filter.createdBy = req.user.id;
    }

    if (req.query.standards) {
      filter.$or = [
        { classNumber: req.query.standards },
        { standards: req.query.standards }
      ];
    }

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const videos = await Video.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: err.message
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,    // only the teacher who uploaded it can delete
      schoolId: req.user.schoolId
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found or not authorized"
      });
    }

    res.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: err.message
    });
  }
};