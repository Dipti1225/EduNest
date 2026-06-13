import Course from "../models/Course.js";
import TeacherAllocation from "../models/TeacherAllocation.js";

import path from "path";
import fs from "fs";

export const uploadCourseMaterial = async (req, res) => {
  try {
    const { title, subject, standard, classNumber, fileType } = req.body;

    const isAllowed = await TeacherAllocation.findOne({
      teacherId: req.user.id,
      standard,
      subject,
      classNumber,
    });

    if (!isAllowed) {
      return res.status(403).json({ message: "You are not allowed to upload for this subject/class" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/courses/${req.file.filename}`;

    const course = new Course({
      title,
      subject,
      standard,
      classNumber,
      fileType,
      fileUrl,
      uploadedBy: req.user.id,
      schoolId: req.user.schoolId,
    });

    await course.save();
    res.status(201).json({ message: "Material uploaded successfully", course });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getCourseMaterials = async (req, res) => {
  try {
    const { standard, subject, classNumber } = req.query;

    const query = {
      schoolId: req.user.schoolId,
    };

    if (standard) query.standard = standard;
    if (subject) query.subject = subject;
    if (classNumber) query.classNumber = classNumber;

    const materials = await Course.find(query).sort({ createdAt: -1 });

    res.status(200).json({ materials });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};
