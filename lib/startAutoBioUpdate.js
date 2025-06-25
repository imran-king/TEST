const moment = require('moment-timezone');
const config = require('../config');

const startAutoBioUpdate = async (conn) => {
  if (config.AUTO_BIO !== "true") return;

  const bioList = [
    "『SHABAN-MD』 شَعبان MD آن فائر!",
    "I’m not perfect but I'm limited edition",
    "راج کرنے آیہ ہوں 🤫",
    "ٱللّٰـهُ أَكـبـر",
    "『SHABAN-MD』 Always On Never Off"
  ];

  let index = 0;

  setInterval(async () => {
    const bio = bioList[index % bioList.length];

    await conn.updateProfileStatus(bio)
      .then(() => console.log("✅ Bio updated:", bio))
      .catch(err => console.log("❌ Bio update failed:", err.message));

    index++;
  }, 10 * 60 * 1000); // Every 10 minutes
};

module.exports = startAutoBioUpdate;