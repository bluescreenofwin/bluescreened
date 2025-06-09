// lib/apiGatewayClient.js
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const REGION = process.env.API_REGION;
const DOMAIN = process.env.API_DOMAIN;   // e.g. "njgg1kf1l4.execute-api.us-east-1.amazonaws.com"
const STAGE  = process.env.API_STAGE;    // e.g. "prod"

export async function signAndFetch(path, method, body) {
  const request = new HttpRequest({
    protocol: "https:",
    hostname: DOMAIN,
    method,
    path: `/${STAGE}${path}`,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const signer = new SignatureV4({
    service: "execute-api",
    region: REGION,
    credentials: defaultProvider(),
  });

  const signed = await signer.sign(request);
  return fetch(`https://${DOMAIN}/${STAGE}${path}`, signed);
}
