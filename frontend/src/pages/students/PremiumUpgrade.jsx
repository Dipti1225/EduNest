import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { CreditCard, Award, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function PremiumUpgrade() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/users/upgrade-premium", { feesPaid: 499 });
      if (response.data.success) {
        setMessage("🎉 Payment Successful! You are now a Premium Member!");
        // Update user context (this also updates localStorage)
        setUser(response.data.user);
        setTimeout(() => {
          navigate("/students/dashboard");
        }, 2000);
      } else {
        setMessage("❌ Upgrading failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("❌ Network or server error during payment simulation.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <div className="card bg-base-100 max-w-md w-full p-8 shadow-2xl text-center border-t-8 border-primary">
          <Award size={64} className="mx-auto text-primary mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-primary mb-2">You are a Premium Member!</h2>
          <p className="text-base-content/60 mb-6">
            You already have access to the ultimate benchmarking experience. Browse files and videos from other schools now!
          </p>
          <button className="btn btn-primary w-full" onClick={() => navigate("/students/video-material")}>
            Access Premium Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300">
        
        {/* Left Side: Premium Benefits Marketing */}
        <div className="bg-gradient-to-br from-primary to-secondary text-primary-content p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="badge badge-accent font-bold px-3 py-2">EduNest Premium</span>
              <span className="badge badge-ghost text-xs">Unlock All</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Elevate Your Learning Potential</h2>
            <p className="text-primary-content/80 mb-6">
              Benchmarking is the key to real-world educational success. Compare what other top institutions are studying.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-primary-content/15 rounded-lg"><BookOpen size={20} /></div>
                <span>Access notes from other schools/colleges</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-primary-content/15 rounded-lg"><Zap size={20} /></div>
                <span>Watch premium lectures & study videos</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-primary-content/15 rounded-lg"><ShieldCheck size={20} /></div>
                <span>Compare teaching standards & syllabi</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-content/10">
            <p className="text-xs text-primary-content/60">One-time term fee</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">₹499</span>
              <span className="text-sm text-primary-content/75">/ semester</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form Simulation */}
        <div className="p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <CreditCard className="text-secondary" /> Payment Checkout
          </h3>
          <p className="text-sm text-base-content/60 mb-6">Simulation for academic upgrades (No real money charged)</p>

          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div>
              <label className="label"><span className="label-text">Cardholder Name *</span></label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                className="input input-bordered w-full"
                value={nameOnCard}
                onChange={e => setNameOnCard(e.target.value)}
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Card Number *</span></label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength="19"
                  placeholder="4111 2222 3333 4444" 
                  required 
                  className="input input-bordered w-full pr-10"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                />
                <CreditCard className="absolute right-3 top-3.5 text-base-content/40" size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label"><span className="label-text">Expiry Date *</span></label>
                <input 
                  type="text" 
                  maxLength="5"
                  placeholder="MM/YY" 
                  required 
                  className="input input-bordered w-full"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                />
              </div>
              <div>
                <label className="label"><span className="label-text">CVV / CVC *</span></label>
                <input 
                  type="password" 
                  maxLength="3"
                  placeholder="***" 
                  required 
                  className="input input-bordered w-full"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {message && (
              <div className={`alert mt-2 ${message.startsWith("🎉") ? "alert-success text-success-content" : "alert-error"}`}>
                <span className="text-sm font-semibold">{message}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                `Simulate Payment of ₹499`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
