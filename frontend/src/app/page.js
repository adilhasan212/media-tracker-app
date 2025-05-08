"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [loginForm, setLoginForm] = useState(false);
  const [registerForm, setRegisterForm] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState(null);
  const [userMenu, setUserMenu] = useState(false);

  const [addMediaForm, setAddMediaForm] = useState(false);
  const [mediaStatus, setMediaStatus] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaPlatform, setMediaPlatform] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaNotes, setMediaNotes] = useState("");

  const handleLogin = () => {
    setLoginForm(!loginForm);
    setRegisterForm(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        throw new Error("Login failed");
      }

      const userData = await res.json();
      setUser(userData);
      handleClose();
    }
    catch (err) {
      alert("Invalid login credentials");
      console.error(err);
    }
  };

  const handleRegister = () => {
    setRegisterForm(!registerForm);
    setLoginForm(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !username || !password || !confirmPassword) {
      alert("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (res.status === 409) {
        const text = await res.text();
        alert(text);
        return;
      }
  
      if (res.ok) {
        const newUser = await res.json();
        setUser(newUser);
        handleClose();
      } else {
        const err = await res.text();
        alert("Registration failed: " + err);
      }
    } catch (err) {
      alert("Server error. Try again later.");
      console.error(err);
    }
  };
  
  const handleUserMenu = () => {
    setUserMenu(!userMenu);
  }

  const handleClose = () => {
    setLoginForm(false);
    setRegisterForm(false);
    setUserMenu(false);
    setAddMediaForm(false);
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  const handleAddMediaForm = () => {
    if (!user) {
      setLoginForm(!loginForm);
    }
    else {
      setAddMediaForm(!addMediaForm);
    }
  };

  const handleAddMediaSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://localhost:8080/api/media/createMedia/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaType,
          mediaTitle,
          mediaStatus,
          mediaPlatform,
          mediaNotes,
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
  
      const data = await res.json();
      console.log("Media added:", data);
      handleClose();
    } catch (err) {
      alert("Failed to add media: " + err.message);
      console.error(err);
    }
  };
  

  if (typeof window !== "undefined") {
    window.onkeydown = handleEscapeKey;
  };

  return (
    <main className="relative min-h-screen bg-white dark:bg-zinc-900 p-4">
      {/* Content wrapper */}
      <div className="relative z-10">
        <nav
          id="navbar"
          className="bg-blue-500 dark:bg-blue-900 py-8 px-10 rounded-lg shadow-md flex justify-between items-center"
        >
          <div className="flex-1">
            <h1
              id="title"
              className="text-3xl font-semibold text-white tracking-wide"
            >
              Media Tracker
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 justify-center">
            <input
              id="search"
              type="text"
              placeholder="Search Shows or Movies"
              className="dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg pr-40 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 flex justify-end gap-6">
            <button 
            className="transition ease-in-out duration-300 hover:text-gray-400 hover:scale-[1.1] cursor-pointer">
              Collections
            </button>
            {!user && (<button
              className="transition ease-in-out duration-300 hover:text-gray-400 hover:scale-[1.1] cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>)}

            {user && (<button
              className="transition ease-in-out duration-300 hover:text-gray-400 hover:scale-[1.1] cursor-pointer"
              onClick={handleUserMenu}
            >
              {user.username}
            </button>)}
          </div>
          
        </nav>

        <div className="flex justify-center mt-10">
          <button
            id="add-button"
            onClick={handleAddMediaForm}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition ease-in-out duration-300 cursor-pointer shadow-md"
          >
            + Add Media
          </button>
        </div>
      </div>

      {/* Dim background overlay */}
      {(loginForm || registerForm || userMenu || addMediaForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 ease-in-out z-20"></div>
      )}

      {/* Login Form modal */}
      {loginForm && (
        <div className="fixed inset-0 flex justify-center items-center z-30">
          <form
            onSubmit={handleLoginSubmit}
            id="login-form"
            className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Login
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-red-300 text-lg font-bold"
              >
                ✕ 
              </button>
            </div>

            <input
              type="text"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 cursor-pointer w-full mb-4"
            >
              Login
            </button>

            <div className="flex justify-center mt-4">
              <p className="text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <span
                  onClick={() => handleRegister()}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Register Form modal */}
      {registerForm && (
        <div className="fixed inset-0 flex justify-center items-center z-30">
        <form 
          id="register-form"
          onSubmit={handleRegisterSubmit}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <div className="w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Register
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-red-300 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 cursor-pointer w-full mb-4"
            >
              Register
            </button>

            <div className="flex justify-center mt-4">
              <p className="text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => handleLogin()}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      )} 

      {/* User Menu */}
      {userMenu && (
        <div className="fixed inset-0 flex justify-center items-center z-30">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <div className="w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  User Menu
                </h2>
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-red-300">
                ✕
              </button>
            </div>
            <div className="w-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Welcome {user.username}!</p>
            </div>
            <button
              onClick={() => {
                setUser(null);
                handleUserMenu();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 cursor-pointer w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Add Media Form */}

      {addMediaForm && 
        (
          <div className="fixed inset-0 flex justify-center items-center z-30">
            <form
              id="add-media-form"
              className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-128"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-full text-center">
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Add Media
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-red-300 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option disabled value="">Select Media Type</option>
                <option className="text-black dark:text-white" value="Show">Show</option>
                <option className="text-black dark:text-white" value="Movie">Movie</option>
                <option className="text-black dark:text-white" value="Documentary">Documentary</option>
                <option className="text-black dark:text-white" value="Book">Book</option>
                <option className="text-black dark:text-white" value="Podcast">Podcast</option>
                <option className="text-black dark:text-white" value="Game">Game</option>
              </select>


              <input
                type="text"
                placeholder="Title"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={mediaStatus}
                onChange={(e) => setMediaStatus(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option disabled value="">Select Status</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Watching">Currently Watching</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="text"
                placeholder="Platform (optional)"
                value={mediaPlatform}
                onChange={(e) => setMediaPlatform(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Notes (optional)"
                value={mediaNotes}
                onChange={(e) => setMediaNotes(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                onClick={handleAddMediaSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 cursor-pointer w-full"
              >
                Add Media
              </button>
            </form>
          </div>
        )
      }
    </main>
  );
}
