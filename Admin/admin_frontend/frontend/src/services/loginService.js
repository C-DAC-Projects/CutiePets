// src/services/loginService.js
import axios from "axios";

const API_BASE = "https://localhost:44337/api/auth";

export const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${API_BASE}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return res; // Return full axios response
  } catch (error) {
    // Re-throw for the component to handle
    throw error;
  }
};
