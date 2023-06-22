// src/store.js
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import * as PIXI from "pixi.js";
import { Shroom } from "@tetreum/shroom";
const storedAccessToken = localStorage.getItem("access_token");
const storedUser = JSON.parse(localStorage.getItem("user"));

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    roomId: "home",
    hideHeader: false,
    showSplashScreen: true,
    rooms: {},
    catalog: [],
    currentRoom: null,
    //Auth
    user: storedUser,
    accessToken: storedAccessToken,
    pixiInstance: null,
  },
  mutations: {
    setPixiInstance(state, instance) {
      state.pixiInstance = instance;
    },
    setShroom(state, shroom) {
      state.shroom = shroom;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setHideHeader(state, value) {
      state.hideHeader = value;
    },
    setShowSplashScreen(state, value) {
      state.showSplashScreen = value;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setCatalog(state, catalog) {
      state.catalog = catalog;
    },
    updateRoom(state, { roomId, items }) {
      Vue.set(state.rooms, roomId, items);
    },
    setAccessTokenAndUser(state, { token, user }) {
      state.accessToken = token;
      state.user = user;
    },
  },
  getters: {
    pixiInstance: (state) => state.pixiInstance,
    shroom: (state) => state.shroom,
    loggedInUser: (state) => state.user,
    isUserLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    async authenticate({ commit }, accessToken) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DUCKET_URL}/api/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const user = response.data;

        // Save the access token and user data in the Vuex state
        commit("setAccessTokenAndUser", { token: accessToken, user: user });

        // Save the access token and user data in localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        return true;
      } catch (error) {
        console.error("Error authenticating user:", error);
        return false;
      }
    },

    initPixiInstance({ commit }) {
      if (!PIXI.utils.isWebGLSupported()) {
        throw new Error("WebGL is not supported");
      }

      const pixiInstance = PIXI.autoDetectRenderer({
        width: 0,
        height: 0,
        autoDensity: true,
        resolution: window.devicePixelRatio,
        forceCanvas: false, // forceCanvas should be set to false (default value)
      });

      // Disable automatic starting of the application ticker
      const app = new PIXI.Application({
        view: pixiInstance.view,
        ticker: new PIXI.Ticker().stop(),
      });

      let shroom = Shroom.createShared({
        application: this.app, // Replace 'this.application' with 'this.app'
        resourcePath: "https://ducket-net.github.io/resources",
      });

      commit("setShroom", shroom);
      // Set the PIXI instance in the store
      commit("setPixiInstance", app);
    },
    updateShowSplashScreen({ commit }, value) {
      commit("setShowSplashScreen", value);
    },
    async fetchCurrentRoom({ commit }, roomId) {
      try {
        let roomData;

        // Check if room data exists in local storage
        if (localStorage.getItem("savedRoom")) {
          roomData = JSON.parse(localStorage.getItem("savedRoom"));
        } else {
          // If no room data in local storage, fetch from server
          // Replace the URL with your actual server URL
          const response = await axios.get(`/room-${roomId}.json`);
          roomData = response.data;
        }

        commit("setCurrentRoom", roomData);
        return roomData;
      } catch (error) {
        console.error("Error fetching room:", error);
        return null;
      }
    },
    async selectRoomById({ commit, dispatch }, roomId) {
      const room = await dispatch("fetchCurrentRoom", roomId);
      if (room) {
        commit("setCurrentRoom", room);
      }
    },
    async fetchCatalog({ commit }) {
      const response = await axios.get(`/catalog.json`);
      commit("setCatalog", response.data.catalog);
    },
    async fetchSearchResults({ commit }, searchQuery) {
      try {
        const ducketUrl = process.env.DUCKET_URL;
        const response = await axios.get(
          `${ducketUrl}/api/marketSearch/basicSearch?search=${searchQuery}`
        );
        commit("setCatalog", response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
  },
});
