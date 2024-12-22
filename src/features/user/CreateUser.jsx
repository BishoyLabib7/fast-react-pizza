import { useState } from "react";
import { useDispatch } from "react-redux";
import { updteName } from "./userSlice";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [username, setUsername] = useState("");
const navigate=useNavigate()
  const dispatch = useDispatch();
  function handleSubmit(e) {
    e.preventDefault();
    if(!username) return;

    dispatch(updteName(username));
    navigate('/menu')
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-stone-600 text-sm md:text-base">
        👋 Welcome! Please start by telling us your name:
      </p>

      <input
        className="w-72"
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {username !== "" && (
        <div>
          <button>Start ordering</button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
