// lib/apiGatewayClient.js
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";

// These **must** match the keys you set in Amplify’s Environment variables
const REGION     = process.env.API_REGION;
const DOMAIN     = process.env.API_DOMAIN;    // e.g. "njgg1kf1l4.execute-api.us-east-1.amazonaws.com"
const STAGE      = process.env.API_STAGE;     // e.g. "prod"
const ACCESS_KEY = process.env.DDB_ACCESS_KEY_ID;
const SECRET_KEY = process.env.DDB_SECRET_ACCESS_KEY;

if (!ACCESS_KEY || !SECRET_KEY || !REGION || !DOMAIN || !STAGE) {
  throw new Error(
    "[apiGatewayClient] missing one of: API_REGION, API_DOMAIN, API_STAGE, DDB_ACCESS_KEY_ID, DDB_SECRET_ACCESS_KEY"
  );
}

export async function signAndFetch(path, method, body) {
  const urlPath = `/${STAGE}${path}`;
  const request = new HttpRequest({
    protocol: "https:",
    hostname: DOMAIN,
    method,
    path: urlPath,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const signer = new SignatureV4({
    service: "execute-api",
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const signed = await signer.sign(request);
  return fetch(`https://${DOMAIN}${urlPath}`, signed);
}
