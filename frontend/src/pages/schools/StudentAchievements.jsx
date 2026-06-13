import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function StudentAchievements() {
  const { id } = useParams();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/achievements/${id}`)
      .then((res) => res.json())
      .then(setAchievements);
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Student Achievements</h2>
      <ul className="list-disc pl-5">
        {achievements.map((a) => (
          <li key={a._id}>
            <strong>{a.title}</strong> - {a.description} ({new Date(a.date).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
