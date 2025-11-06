import React, { useEffect, useState } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/hello/`)
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch(() => setData("Error connecting to backend"));
  }, []);

  return <h2>{data || "Loading..."}</h2>;
}

export default DataFetcher;
