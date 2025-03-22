// import { KJUR } from "jsrsasign";
import { funcRandom } from "./main.js";

alert("Mail Box Detected");

const CLIENT_ID = encodeURIComponent(
  "246593445896-am0k1lupf66tqghpvu64l4ipovrldqse.apps.googleusercontent.com"
);
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent(
  "https://mbelcdgbjclcpgdcfemfdcoejgdmcklk.chromiumapp.org/"
);
const SCOPE = encodeURIComponent("apds");
const STATE = encodeURIComponent(
  "meet" + Math.random().toString(36).substring(2, 15)
);
const PROMPT = encodeURIComponent("consent");

function create_auth_endpoint() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  );

  // encodeURIComponent(['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/calendar.readonly'].join(' ').toString())
  let openId_endpoint_url = `https://accounts.google.com/o/oauth2/v2/auth
    ?client_id=${CLIENT_ID}
    &response_type=${RESPONSE_TYPE}
    &redirect_uri=${REDIRECT_URI}
    &scope=${SCOPE}
    &state=${STATE}
    &nonce=${nonce}
    &prompt=${PROMPT}`;

  console.log(openId_endpoint_url);
  return openId_endpoint_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  funcRandom();
  if (request.message === "login") {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_auth_endpoint(),
        interactive: true,
      },
      function (redirect_url) {
        if (chrome.runtime.lastError) {
          // problem signing in
        } else {
          let id_token = redirect_url.substring(
            redirect_url.indexOf("id_token=") + 9
          );
          id_token = id_token.substring(0, id_token.indexOf("&"));
          console.log(id_token);

          // const user_info = KJUR.jws.JWS.readSafeJSONString(
          //   b64utoutf8(id_token.split(".")[1])
          // );
          // console.log(user_info);

          // if (
          //   (user_info.iss === "https://accounts.google.com" ||
          //     user_info.iss === "accounts.google.com") &&
          //   user_info.aud === CLIENT_ID
          // ) {
          //   console.log("User successfully signed in.");
          // } else {
          //   console.log("Invalid credentials.");
          // }
        }
      }
    );

    return true;
  }
});

// chrome.identity.getAuthToken({ interactive: true }, (token) => {
//   if (chrome.runtime.lastError) {
//     console.error("OAuth Error:", chrome.runtime.lastError);
//     return;
//   }

//   console.log("OAuth Token:", token);

//   // Fetch user info
//   fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((userInfo) => {
//       console.log("User Info:", userInfo);
//       chrome.storage.local.set({ user: userInfo });
//     })
//     .catch((error) => {
//       console.error("Error fetching user info:", error);
//     });

//   // Fetch Gmail data
//   fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((emails) => {
//       console.log("Emails:", emails);
//       chrome.storage.local.set({ emails: emails.messages });
//     })
//     .catch((error) => {
//       console.error("Error fetching emails:", error);
//     });
// });
