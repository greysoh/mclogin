import axios from "https://esm.sh/redaxios@0.5.1";

export async function mcLogin(xblXSTSToken: String, xblXSTSUserhash: String) {
  const mcLoginData = await axios.post("https://api.minecraftservices.com/authentication/login_with_xbox", {
    "identityToken": "XBL3.0 x=" + xblXSTSUserhash + ";" + xblXSTSToken
  });

  return {
    "token": mcLoginData.data.access_token,
    "tokenType": mcLoginData.data.token_type,
    "expiresIn": mcLoginData.data.expires_in
  }
}
