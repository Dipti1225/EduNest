import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AcademicRecords() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/academics/${id}`)
      .then((res) => res.json())
      .then(setRecords);
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Academic Records</h2>
      <table className="table w-full">
        <thead>
          <tr><th>Subject</th><th>Score</th><th>Term</th><th>Remarks</th></tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.subject}</td><td>{r.score}</td><td>{r.term}</td><td>{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
