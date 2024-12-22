import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [quary, setQuary] = useState();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!quary) return;
    navigate(`/order/${quary}`);
    setQuary("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="search order #"
        value={quary}
        onChange={(e) => setQuary(e.target.value)}
      />
    </form>
  );
}

export default SearchOrder;
