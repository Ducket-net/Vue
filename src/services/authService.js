// authService.js
import axios from "axios";

const clientId = "5";
const clientSecret = "hMBIIs4ahklffeKJjs2A6HHVVWSNu78xlBMpxsPJ";
const ducketUrl = process.env.VUE_APP_DUCKET_URL;
const appUrl = process.env.VUE_APP_URL;

const authService = {
  getAuthorizationCode() {
    const url =
      `${ducketUrl}/oauth/authorize?client_id=` +
      clientId +
      `&redirect_uri=${appUrl}/auth/callback&response_type=code&scope=*`;
    window.location.href = url;
  },

  async getAccessToken(code) {
    try {
      const response = await axios.post(`${ducketUrl}/oauth/token`, {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/auth/callback`,
        code,
      });
      const token = response.data.access_token;
      // Save token (e.g., in localStorage, Vuex, or cookies)
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  },
};

export default authService;
