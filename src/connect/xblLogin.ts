import axios from "https://esm.sh/redaxios@0.5.1";

export async function xblLogin(azureToken: String) {
  const xblLoginData = await axios.post("https://user.auth.xboxlive.com/user/authenticate", {
    "Properties": {
      "AuthMethod": "RPS",
      "SiteName": "user.auth.xboxlive.com",
      "RpsTicket": "d=" + azureToken
    },
    "RelyingParty": "http://auth.xboxlive.com",
    "TokenType": "JWT"
  });

  return {
    token: xblLoginData.data.Token,
    uhs: xblLoginData.data.DisplayClaims.xui[0].uhs
  };
}

export async function xblXSTSLogin(xblToken: String) {
  const xblLoginData = await axios.post("https://xsts.auth.xboxlive.com/xsts/authorize", {
    "Properties": {
      "SandboxId": "RETAIL",
      "UserTokens": [
        xblToken
      ]
    },
    "RelyingParty": "rp://api.minecraftservices.com/",
    "TokenType": "JWT"
  });

  return {
    token: xblLoginData.data.Token,
    uhs: xblLoginData.data.DisplayClaims.xui[0].uhs
  };
}
