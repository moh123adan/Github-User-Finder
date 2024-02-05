import { createContext, useReducer } from "react";
import axios from "axios";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = import.meta.env.VITE_REACT_APP_GITHUB_URL;

const GITHUB_TOKEN = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  //HANDLE DELETE FUNCTION
  const clearUsers = () => dispatch({ type: "CLEAR_USERS" });

  //get search result
  const searchUsers = async (text) => {
    setLoading();
    try {
      const params = new URLSearchParams({
        q: text,
      });

      const res = await axios.get(`${GITHUB_URL}/search/users?${params}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });

      const { items } = await res.data;

      dispatch({
        type: "GET_USERS",
        payload: items,
      });
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  //get single user
  const getUser = async (login) => {
    setLoading();
    try {
      const res = await axios.get(`${GITHUB_URL}/users/${login}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });

      if (Response.status === 404) {
        window.location = "/notfound";
      } else {
        const data = await res.data;

        dispatch({
          type: "GET_USER",
          payload: data,
        });
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  //Get User repos
  const getUserRepos = async (login) => {
    setLoading();

    try {
      const params = new URLSearchParams({
        sort: "created",
        per_page: 10,
      });

      const res = await axios.get(
        `${GITHUB_URL}/users/${login}/repos?${params}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        }
      );

      const data = await res.data;

      dispatch({
        type: "GET_REPOS",
        payload: data,
      });
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  //set loading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
