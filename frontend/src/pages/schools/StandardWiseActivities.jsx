import { useEffect, useState } from "react";

export default function StandardWiseActivities() {
  const [groupedActivities, setGroupedActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/activities/grouped")
      .then((res) => res.json())
      .then(setGroupedActivities)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Standard-wise Activity Updates</h2>
      {groupedActivities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        groupedActivities.map((group) => (
          <div key={group._id} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700">{group._id}</h3>
            <ul className="list-disc pl-5">
              {group.activities.map((activity, index) => (
                <li key={index} className="mb-2">
                  <strong>{activity.title}</strong> - {activity.description}{" "}
                  <span className="text-gray-500 text-sm">
                    ({new Date(activity.date).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
