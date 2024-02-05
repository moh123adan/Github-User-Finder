import React from "react";
import UserResults from "../components/users/UserResults";
import UserSearch from "../components/users/UserSearch";

function Home() {
  //   const githubToken = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

  return (
    <div>
      <>
        <UserSearch />
        <UserResults />
      </>
    </div>
  );
}
export default Home;
