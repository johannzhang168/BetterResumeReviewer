export const GetCurrentUser = async () => {
  try {
    const BASEURL = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem("jwt");
    if (!token) {
      return null;
    }
    const response = await fetch(`${BASEURL}/current-user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }
    const data = await response.json()
    return data.user
  } catch (error){
    console.error("Error fetching current user:", error);
    return null;
  }
}