import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";

const StudentSideSyllabus = ({ user }) => {
  const [syllabus, setSyllabus] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fetchSyllabus = async () => {
    try {
      const res = await api.get("/syllabus/student", { params: { classNumber: user.classNumber } });
      setSyllabus(res.data);
    } catch {
      toast.error("❌ Failed to fetch syllabus");
    }
  };

  useEffect(() => { fetchSyllabus(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-secondary">📄 Student Syllabus</h1>

      {syllabus.length === 0 ? (
        <p className="text-gray-500">No syllabus available for your class.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {syllabus.map((s) => (
            <div key={s._id} className="card bg-base-100 shadow-md border">
              <div className="card-body">
                <h2 className="card-title">{s.title}</h2>
                <p className="text-sm">📖 {s.subject}</p>
                <button
                  className="btn btn-outline btn-sm mt-3"
                  onClick={() => setSelectedPdf(`http://localhost:5001${s.pdfUrl}`)}
                >
                  📘 View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-xl overflow-hidden">
            <button
              className="absolute top-3 right-3 btn btn-sm btn-circle btn-error"
              onClick={() => setSelectedPdf(null)}
            >
              ✕
            </button>
            <iframe
              src={selectedPdf}
              title="PDF Viewer"
              className="w-full h-full"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSideSyllabus;
