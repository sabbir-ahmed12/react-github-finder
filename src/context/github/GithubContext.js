import { createContext, useState } from "react";

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

export const GithubProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (text) => {
    setLoading(true);
    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`);

    const { items } = await response.json();

    setUsers(items);
    setLoading(false);
  };

  const clearUsers = () => {
    setUsers([]);
  };

  return (
    <GithubContext.Provider value={{ users, loading, searchUsers, clearUsers }}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
