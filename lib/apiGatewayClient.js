// lib/apiGatewayClient.js
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const REGION = process.env.AWS_REGION || process.env.REGION;
const DOMAIN = "njgg1kf1l4.execute-api." + REGION + ".amazonaws.com";
const STAGE  = "prod";  // or whatever stage you deployed

async function signAndFetch(path, method, body) {
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
    credentials: defaultProvider(),
    region: REGION,
    service: "execute-api",
  });

  const signed = await signer.sign(request);
  return fetch(`https://${DOMAIN}${urlPath}`, signed);
}

export function invokeListPosts() {
  return signAndFetch("/posts", "GET");
}

export function invokeCreatePost(post) {
  return signAndFetch("/posts", "POST", post);
}

export function invokeDeletePost(id) {
  return signAndFetch(`/posts/${id}`, "DELETE");
}
