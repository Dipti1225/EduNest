import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";

const StudentTests = () => {
  const { user } = useUser();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.classNumber) {
      setLoading(false);
      return;
    }
    api.get(`/tests/student/${user.classNumber}`)
      .then(res => setTests(res.data.data || []))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, [user]);

  const startTest = (test) => {
    setSelectedTest(test);
    setAnswers(Array(test.questions.length).fill(""));
    setResult(null);
  };

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const submitTest = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/tests/submit", {
        testId: selectedTest._id,
        answers
      });
      setResult(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Test taking view
  if (selectedTest) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-2">{selectedTest.title}</h2>
        <p className="text-base-content/60 mb-4">
          {selectedTest.subject && `Subject: ${selectedTest.subject} · `}
          Duration: {selectedTest.duration} mins · {selectedTest.questions.length} questions
        </p>

        {result ? (
          <div className="space-y-4">
            <div className={`alert ${result.percentage >= 50 ? "alert-success" : "alert-warning"}`}>
              <div>
                <h3 className="font-bold text-lg">Test Completed!</h3>
                <p>Score: {result.score} / {result.totalQuestions} ({result.percentage}%)</p>
              </div>
            </div>

            {/* Show correct answers */}
            <div className="space-y-3">
              {selectedTest.questions.map((q, idx) => {
                const isCorrect = answers[idx]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
                return (
                  <div key={idx} className={`card ${isCorrect ? "bg-success/10" : "bg-error/10"} p-3`}>
                    <p className="font-medium">Q{idx + 1}: {q.question}</p>
                    <p className="text-sm">Your answer: <span className="font-medium">{answers[idx] || "—"}</span></p>
                    {!isCorrect && <p className="text-sm text-success">Correct: {q.correctAnswer}</p>}
                  </div>
                );
              })}
            </div>

            <button className="btn btn-primary" onClick={() => { setSelectedTest(null); setResult(null); }}>
              Back to Tests
            </button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); submitTest(); }}>
            {selectedTest.questions.map((q, idx) => (
              <div key={idx} className="mb-6 card bg-base-100 shadow-sm p-4">
                <div className="font-semibold mb-2">Q{idx + 1}: {q.question}</div>
                {q.type === "MCQ" && q.options?.length > 0 ? (
                  <div className="space-y-2">
                    {q.options.map((opt, oidx) => (
                      <label key={oidx} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200 transition">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          className="radio radio-primary"
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : q.type === "True/False" ? (
                  <div className="space-y-2">
                    {["True", "False"].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200 transition">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          className="radio radio-primary"
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    className="input input-bordered w-full"
                    placeholder="Your answer..."
                    value={answers[idx]}
                    onChange={e => handleAnswer(idx, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Submit Test"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setSelectedTest(null)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Tests list
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Available Tests</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.length === 0 && <p className="text-base-content/50">No tests available for your class.</p>}
          {tests.map((test) => (
            <div key={test._id} className="card bg-base-100 shadow-sm hover:shadow-md transition">
              <div className="card-body p-4 flex-row justify-between items-center">
                <div>
                  <h3 className="font-semibold">{test.title}</h3>
                  <p className="text-sm text-base-content/60">
                    {test.subject && `${test.subject} · `}
                    {test.questions?.length} questions · {test.duration} mins
                    {test.createdBy?.name && ` · by ${test.createdBy.name}`}
                  </p>
                </div>
                <button className="btn btn-accent btn-sm" onClick={() => startTest(test)}>
                  Attempt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTests;
