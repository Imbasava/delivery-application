import React, { useState, useEffect } from "react";

export const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    aadhar: "",
    age: "",
    photo: null,
    photoPreview: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: localStorage.getItem("firstName"),
            aadhar: data.aadhar || "",
            age: data.age || "",
            photo: null,
            photoPreview: data.photo.startsWith("http")
              ? data.photo
              : `http://localhost:8080/${data.photo}`,
          });
        } else {
          setProfile((prev) => ({
            ...prev,
            name: localStorage.getItem("firstName"),
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({
      ...profile,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("aadhar", profile.aadhar);
    formData.append("age", profile.age);
    formData.append("photo", profile.photo);

    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {profile.aadhar ? "Edit Profile" : "Create Profile"}
        </h1>

        {profile.photoPreview && (
          <div className="flex justify-center mb-4">
            <img
              src={profile.photoPreview}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-md"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Aadhar Number
            </label>
            <input
              type="text"
              name="aadhar"
              value={profile.aadhar}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Upload Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              required={!profile.photoPreview}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};
