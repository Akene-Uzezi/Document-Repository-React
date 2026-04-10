import { useState } from "react";

const useFetchRecents = (token) => {
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchResents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecents(data.files);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return { recents, loading, setLoading, fetchResents };
};

export default useFetchRecents;
