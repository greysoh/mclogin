import axios from "https://esm.sh/redaxios@0.5.1";

export async function azureCodeAuth(tenantType: String, clientID: String, scopes: String[]): Promise<String> {
  const initialCodeAuthParams = new URLSearchParams();
  initialCodeAuthParams.append("client_id", clientID);
  initialCodeAuthParams.append("scope", scopes.join(" "));

  const initialCodeAuth = await axios.post("https://login.microsoftonline.com/" + tenantType + "/oauth2/v2.0/devicecode", initialCodeAuthParams);

  console.log(initialCodeAuth.data.message);
  console.log("This link will expire in " + initialCodeAuth.data.expires_in/60 + " minutes.");

  while (true) {
    try {
      const azureAuthParams = new URLSearchParams();
      azureAuthParams.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code");
      azureAuthParams.append("client_id", clientID);
      azureAuthParams.append("device_code", initialCodeAuth.data.device_code);

      const azureAuth = await axios.post("https://login.microsoftonline.com/" + tenantType + "/oauth2/v2.0/token", azureAuthParams);

      return {
        token: azureAuth.data.access_token,
        refreshToken: scopes.includes("offline_access") ? azureAuth.data.refresh_token : null
      };
    } catch (e) {
      if (e.data.error != "authorization_pending") {
        throw(e.data.error);
      }
    }

    await new Promise((i) => setTimeout(i, initialCodeAuth.data.interval*1000));
  }
}

export async function refreshAzureToken(tenantType: String, clientID: String, refreshToken: String): Promise<String> {
  const azureAuthParams = new URLSearchParams();
  azureAuthParams.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code");
  azureAuthParams.append("client_id", clientID);
  azureAuthParams.append("device_code", refreshToken);

  try {
    const azureAuth = await axios.post("https://login.microsoftonline.com/" + tenantType + "/oauth2/v2.0/token", azureAuthParams);

    return azureAuth.data.access_token;
  } catch (e) {
    throw(e.data.error);
  }
}
