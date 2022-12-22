import { azureCodeAuth, refreshAzureToken, xblLogin, xblXSTSLogin, mcLogin } from "./src/mod.js";

let azureToken = {};

console.log("Stage 1: Getting Azure token...");

try {
  azureToken = JSON.parse(await Deno.readTextFile("./AZURE_KEYS.json"));
} catch (e) {
  const azureData = await azureCodeAuth("consumers", "b2e06bb4-e3c2-4565-9fec-647d22bc9607", ["XboxLive.signin", "offline_access"]);
  azureToken = azureData;

  await Deno.writeTextFile("./AZURE_KEYS.json", JSON.stringify(azureData));
}

console.log("Stage 2: Getting XBL Token...")
let xblData;

try {
  xblData = await xblLogin(azureToken.token);
} catch (e) {
  if (e.status == 401) {
    console.log("ROADBLOCK: Azure token is outdated! Refreshing token data");
    azureToken.token = await refreshAzureToken("consumers", "b2e06bb4-e3c2-4565-9fec-647d22bc9607", azureToken.refreshToken);

    await Deno.writeTextFile("./AZURE_KEYS.json", JSON.stringify(azureData));
  }
}

console.log("Stage 3: Getting XBL XSTS Token...");
const xblXSTSData = await xblXSTSLogin(xblData.token);

console.log("Stage 4: Getting Minecraft token...");
const mcLoginData = await mcLogin(xblXSTSData.token, xblXSTSData.uhs);

console.log("Success:\n");
