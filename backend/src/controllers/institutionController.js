import Institution from "../models/Institution.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// this is the file where institution controlls defined
export async function getAllInstitutions(req, res) {
  try {
    const institutions = await Institution.find({ status: "approved" }).select("name");
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getInstitutionProfile(req, res) {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) return res.status(404).json({ message: "Institution not found" });
        res.status(200).json(institution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function getApprovedInstitutions(req, res) {
  try {
    const approvedInstitutions = await Institution.find({ status: 'approved' });
    res.json(approvedInstitutions);
  } catch (error) {
    console.error('Error fetching approved institutions:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function registerInstitution(req, res) {
    try {
        const { name, type, email, contactPerson, phone, address, registrationDocs, mediums, sections, streams, boards, branches, password } = req.body;

        // Validate required fields
        if (!name || !type || !email || !contactPerson || !phone || !password) {
            return res.status(400).json({ message: "All fields, including password, are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        // Create new institution (auto-approve for ease of development/testing)
        const institution = new Institution({
            name,
            type,
            email,
            contactPerson,
            phone,
            address,
            registrationDocs,
            status: 'approved',
            mediums: mediums || [],
            sections: sections || [],
            streams: streams || [],
            boards: boards || [],
            branches: branches || []
        });

        await institution.save();

        // Create the Owner User account automatically
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: contactPerson || name,
            email,
            password: hashedPassword,
            role: "institute",
            schoolId: institution._id,
            contactNumber: phone
        });

        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: "Institution registered successfully and login account created.", 
            institution,
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                schoolId: newUser.schoolId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId, classNumber, subject } = req.body;

    if (!teacherId || !classNumber || !subject) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    // Check if already assigned
    const alreadyAssigned = teacher.assignedClasses.some(
      (entry) =>
        entry.classNumber === classNumber && entry.subject === subject
    );
    if (alreadyAssigned)
      return res
        .status(400)
        .json({ error: "This class and subject is already assigned." });

    teacher.assignedClasses.push({ classNumber, subject });
    await teacher.save();

    res.status(200).json({ message: "Class assigned successfully", teacher });
  } catch (err) {
    console.error("Error assigning class:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export async function updateInstitution(req, res) {
    try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Institution.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Institution not found.' });

    res.json({ message: 'Status updated.', institution: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteInstitution(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Institution.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Institution not found.' });
        res.json({ message: 'Institution deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};