import fetch from "node-fetch";

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getTenantAccessToken(cfg: any): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: cfg.channels.feishu.appId,
      app_secret: cfg.channels.feishu.appSecret,
    }),
  });

  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(`Feishu auth failed: ${json.msg}`);
  }

  cachedToken = {
    value: json.tenant_access_token,
    expiresAt: Date.now() + (json.expire - 60) * 1000,
  };

  return cachedToken.value;
}
