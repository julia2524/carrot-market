export async function getAccessToken(code: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    cache: "no-cache",
  });
  return accessTokenResponse.json();
}

export async function getGithubProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return userProfileResponse.json();
}

export async function getGithubEmail(access_token: string) {
  const userEmailsResponse = await fetch("https://api.github.com/user/emails", {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${access_token}`,
      "X-GitHub-Api-Version": "2026-03-10",
    },
    cache: "no-cache",
  });
  return userEmailsResponse.json();
}
