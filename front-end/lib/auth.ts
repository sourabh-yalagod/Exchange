export const auth = () => {
  if (typeof window === "undefined") return false; // ensures this runs only on the client

  const token = window.localStorage.getItem("token");
  console.log("Token", token);
  return !!token;
};
export const handleLogout=()=>{}