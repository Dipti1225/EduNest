import Note from "../models/Note.js";

export const uploadNote = async (req, res) => {
  try {
    const { title, subject, classNumber } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const note = new Note({
      title,
      subject,
      classNumber,
      schoolId: req.user.schoolId,
      createdBy: req.user.id,
      pdfUrl: `notes/${req.file.filename}`
    });
    await note.save();

    res.status(201).json({ success: true, message: "Note uploaded", data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ schoolId: req.user.schoolId });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

export const getNotesByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;

    const notes = await Note.find({
      classNumber,
      schoolId: req.user.schoolId
    });

    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes for class",
      error: err.message
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    let schoolIdToUse = req.user.schoolId;

    if (req.user.role === "student") {
      // If student is premium and requests another school's notes
      if (req.query.schoolId && req.query.schoolId !== req.user.schoolId.toString()) {
        if (req.user.isPremium) {
          schoolIdToUse = req.query.schoolId;
        } else {
          return res.status(403).json({ success: false, message: "Upgrade to premium to access notes of other institutions." });
        }
      }
    }

    const filter = { schoolId: schoolIdToUse };

    // If teacher, show only their uploaded notes
    if (req.user.role === "teacher") {
      filter.createdBy = req.user.id;
    }

    if (req.query.standards || req.query.classNumber) {
      filter.classNumber = req.query.standards || req.query.classNumber;
    }

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const notes = await Note.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: err.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,   // only the teacher who uploaded can delete
      schoolId: req.user.schoolId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or not authorized"
      });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: err.message
    });
  }
};