import Teacher from "../models/User.js";
//This is tthe controller for managing teachers in the EduNest application.
export async function teacherRegister(req, res) {
    try {
        const newTeacher = new Teacher(req.body);
        await newTeacher.save();
        res.status(201).json({ message: "Teacher registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function teacherOfSpecificInstitute(req, res) {
    const { id } = req.params;
    try {
        const teachers = await Teacher.find({ institute: id });
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

