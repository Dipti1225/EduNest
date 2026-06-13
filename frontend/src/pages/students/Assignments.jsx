import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { ClipboardList, Send, CheckCircle, Clock, Star } from "lucide-react";

const StudentAssignments = () => {
  const { user } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.classNumber) {
      setLoading(false);
      return;
    }
    api.get(`/assignments/class/${user.classNumber}`)
      .then((res) => setAssignments(res.data.data || []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [user]);

  const isSubmitted = (assignment) => {
    return assignment.submissions?.some(
      (s) => s.studentId === user?._id || s.studentId?._id === user?._id
    );
  };

  const getMySubmission = (assignment) => {
    return assignment.submissions?.find(
      (s) => s.studentId === user?._id || s.studentId?._id === user?._id
    );
  };

  const submitAssignment = async () => {
    if (!submission.trim() || !selectedAssignment) return;
    setSubmitting(true);
    try {
      await api.post(`/assignments/submit/${selectedAssignment._id}`, {
        content: submission,
      });
      // Refresh
      const res = await api.get(`/assignments/class/${user.classNumber}`);
      setAssignments(res.data.data || []);
      setSelectedAssignment(null);
      setSubmission("");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Submission Modal
  if (selectedAssignment) {
    return (
      <div className="max-w-2xl mx-auto p-4 pb-24 lg:pb-4">
        <button
          onClick={() => setSelectedAssignment(null)}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to Assignments
        </button>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="text-xl font-bold">{selectedAssignment.title}</h2>
            <p className="text-base-content/60">{selectedAssignment.description}</p>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="badge badge-outline">{selectedAssignment.subject}</span>
              <span className="text-base-content/50">
                Max Marks: {selectedAssignment.maxMarks}
              </span>
              <span className="text-base-content/50">
                Due:{" "}
                {new Date(selectedAssignment.dueDate).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="divider"></div>

            <h3 className="font-semibold">Your Submission</h3>
            <textarea
              className="textarea textarea-bordered w-full min-h-[150px]"
              placeholder="Write your answer here..."
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
            />
            <button
              onClick={submitAssignment}
              className="btn btn-primary gap-2 mt-2"
              disabled={submitting || !submission.trim()}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Send size={16} />
              )}
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="text-secondary" size={28} /> My Assignments
        </h1>
        <p className="text-base-content/60 mt-1">
          View, submit, and track your assignment grades
        </p>
      </div>

      {assignments.length === 0 && (
        <p className="text-base-content/50 text-center py-8">
          No assignments available for your class.
        </p>
      )}

      <div className="space-y-3">
        {assignments.map((a) => {
          const submitted = isSubmitted(a);
          const mySub = getMySubmission(a);
          const isPastDue = new Date(a.dueDate) < new Date();

          return (
            <div
              key={a._id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition border border-base-200"
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                      {a.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="badge badge-outline">{a.subject}</span>
                      <span className="text-base-content/50">
                        Due:{" "}
                        {new Date(a.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="text-base-content/50">
                        Max: {a.maxMarks} marks
                      </span>
                      {a.createdBy?.name && (
                        <span className="text-base-content/50">
                          by {a.createdBy.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {submitted ? (
                      <>
                        <span className="badge badge-success gap-1 text-xs">
                          <CheckCircle size={12} /> Submitted
                        </span>
                        {mySub?.isGraded && (
                          <div className="text-right">
                            <span className="badge badge-primary gap-1 text-xs">
                              <Star size={12} /> Grade: {mySub.grade}
                            </span>
                            {mySub.feedback && (
                              <p className="text-xs text-base-content/60 mt-1 max-w-[200px]">
                                {mySub.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : isPastDue ? (
                      <span className="badge badge-error text-xs">Past Due</span>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(a)}
                        className="btn btn-primary btn-sm gap-1"
                      >
                        <Send size={14} /> Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssignments;
