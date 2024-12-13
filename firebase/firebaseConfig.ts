import { Platform } from "react-native";

let config;

if (Platform.OS === "web") {
  config = require("./firebaseConfig.web");
} else {
  config = require("./firebaseConfig.native");
}

export const auth = config.auth;

export const db = config.db;
