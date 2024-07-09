
import app from "@/src/app"
import configs from "@/src/utils/config";
import { getLocalIPAddress } from "@/src/utils/catch-ip/catchIp";
// import { colors } from "./utils/colors";
import { connectDB } from "./database";
import { createBorderedMessage } from "./utils/create-border/createBorderMessage";



connectDB();

function run(): void {
  const networkAddress = getLocalIPAddress();
  app.listen(configs.port, () => {
    const messages = [
      'User Service starting...',
      '✓ User Service is running on:',
      `  - Local:   http://localhost:${configs.port}`,
      `  - Network: http://${networkAddress}:${configs.port}`
    ];
    console.log(createBorderedMessage(messages));
  });
}

// function run() {
//   app.listen(configs.port, () => {
//     // Application logic here
//     // const localIP = getLocalIPAddress();
//     const borderLine = `${colors.white}${colors.black}============================================${colors.reset}`;
//     console.log(borderLine);
//     console.log(`${colors.green}${colors.bright}User Service${colors.reset} ${colors.dim}starting...${colors.reset}`);
//     console.log(`${colors.green}${colors.bright}✓ User Service is running on:${colors.reset}`);
//     console.log(`  - ${colors.cyan}Local:${colors.reset}   ${colors.green}http://localhost:${configs.port}${colors.reset}`);
//     // console.log(`  - ${colors.cyan}Network:${colors.reset} ${colors.blue}http://${localIP}:${configs.port}${colors.reset}`);
//     console.log(borderLine);
//   });
// }



run();