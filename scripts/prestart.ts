import detectPort from "detect-port";

const checkPort = (start_port: string) => {
  return new Promise((resolve, reject) =>
    detectPort(
      {
        hostname: "localhost",
        port: parseInt(start_port) || 1212
      },
      (err, port) => {
        if (err) {
          reject(err);
          console.error("error: port is in use");
        }

        resolve(port);
      }
    )
  );
};

(async () => {
  await checkPort(process.env.PORT || "1212");
})();
