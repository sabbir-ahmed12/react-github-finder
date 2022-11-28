import { createContext, useState } from "react";
import axios from "axios";

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

export const GithubProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  const github = axios.create({
    baseURL: GITHUB_URL,
  });

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

  // Get Single User
  const getUserAndRepos = async (login) => {
    setLoading(true);

    // Fetching users and repos
    // const userResponse = await fetch(`${GITHUB_URL}/users/${login}`);
    // const reposResponse = await fetch(`${GITHUB_URL}/users/${login}/repos`);
    const userData = await github.get(`/users/${login}`);
    const reposData = await github.get(`/users/${login}/repos`);
    console.log(userData);

    if (userData.request.status === 404) {
      window.location = "/notfound";
    } else {
      // const userData = await userResponse.json();
      // const reposData = await reposResponse.json();
      setUser(userData.data);
      setRepos(reposData.data);
      setLoading(false);
    }
  };

  const clearUsers = () => {
    setUsers([]);
  };

  return (
    <GithubContext.Provider
      value={{
        users,
        loading,
        searchUsers,
        clearUsers,
        user,
        getUserAndRepos,
        repos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
