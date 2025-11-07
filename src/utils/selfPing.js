import axios from "axios";
import APP_CONFIG from "../config/APP_CONFIG.js";
import logger from "../config/logger.js";

export function startSelfPing() {
  if (APP_CONFIG.NODE_ENV !== "production") return;

  const pingUrl = APP_CONFIG.BASE_URL || "https://safetrip-backend-v3.onrender.com/";

  const ping = async () => {
    try {
      const res = await axios.get(pingUrl);
      logger.info(`Self-ping successful: ${res.status}`);
    } catch (err) {
      logger.error(`Self-ping failed: ${err.message}`);
    }
  };

  // Ping immediately
  ping();

  // Ping every 14 minutes
  setInterval(ping, 12 * 60 * 1000);
}
