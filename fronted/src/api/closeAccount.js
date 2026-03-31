import axios from "axios";

export async function closeAccount() {
  // This function should call your backend endpoint to delete the user account and all related data
  // Example endpoint: DELETE /api/user/close-account
  // You may need to pass an auth token or use credentials
  return axios.delete("http://localhost:5000/api/user/close-account", { withCredentials: true });
}
