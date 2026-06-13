import Activity from "../models/Activity.js";

export const getActivitiesGroupedByStandard = async (req, res) => {
  try {
    const activities = await Activity.aggregate([
      {
        $group: {
          _id: "$standard",
          activities: {
            $push: {
              title: "$title",
              description: "$description",
              date: "$date"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activities", error });
  }
};

export const getActivitiesBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const activities = await Activity.find({ schoolId }).sort({ date: -1 });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch activities", error: error.message });
  }
};