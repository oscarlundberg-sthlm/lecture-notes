module.exports = {
  packagerConfig: {
    name: "Lecture Notes",
    icon: "/images/icon_macos", // no file extension required
    extraResource: ["../next-js/out"],
  },
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
  ],
};
