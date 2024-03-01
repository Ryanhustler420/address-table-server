// NOTE:
// Run this when you want to deploy this react app somewhere else
// where same domain has no express server

// Get command-line arguments
const args = process.argv.slice(2);
// Define named arguments
const namedArgs = {};

// Process named arguments
args.forEach((arg) => {
  const [name, value] = arg.split("=");
  if (name && value) namedArgs[name] = value;
});

// Validate arguments
const validateArguments = () => {
  if (!namedArgs["--backend"] && !namedArgs["-b"])
    throw new Error("Argument --backend (-b) is required.");
  if (!namedArgs["--monolithic"] && !namedArgs["-m"])
    throw new Error("Argument --monolithic (-m) is required.");
};

try {
  // Validate arguments before accessing them
  validateArguments();

  // Access named arguments
  const backend = namedArgs["--backend"] || namedArgs["-b"];
  const monolithic = namedArgs["--monolithic"] || namedArgs["-m"];

  let page = '';
  const values = {
    REACT_APP_SERVER_MONOLITHIC_URL: monolithic,
    REACT_APP_SERVER_BACKEND_URL: backend,
    REACT_APP_VERSION: "v1",
    EXTRA: 12,
  }
  for (const key in values) page += `${key}=${values[key]}\n`;

  // Output the arguments
  require("fs").writeFileSync(`${__dirname}/.env`, page, "utf8");
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1); // Exit the process with an error code
}
