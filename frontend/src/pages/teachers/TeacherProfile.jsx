import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const TeacherProfile = () => {
  const [user , setUser] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const [profileImage , setProfileImage] = useState(user?.profileImage || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [role, setRole] = useState(user?.role || "Teacher");


  const [preview, setPreview] = useState(profileImage);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProfileImage(reader.result); // update in context
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      name: name || user.name,
      email: email || user.email,
    };

    setUser(updatedUser);

    // No change to image unless user selects new one
    if (selectedFile === null) {
      setProfileImage(profileImage);
    }

    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Update Profile</h2>

        {/* Avatar Preview */}
        <div className="avatar flex justify-center mb-4">
          <div className="w-24 rounded-full ring ring-info ring-offset-base-100 ring-offset-2">
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt="User Avatar"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="form-control mb-4">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
          </div>

          {/* Name */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder={user?.name || "Enter your name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              placeholder={user?.email || "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Role */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder={user?.role || "Enter your role"}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />    
          </div>

          {/* Submit Button */}
          <div className="form-control mb-6">
            <Link to="/teachers" style={{ insetInlineStart: '10px' }} className="ml-2">
            <button className="btn btn-primary w-full" type="submit">
              Update Profile
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TeacherProfile;
