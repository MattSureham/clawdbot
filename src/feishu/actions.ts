import fetch from "node-fetch";
import { getTenantAccessToken } from "./auth.js";

async function feishuFetch(
  cfg: any,
  url: string,
  body: unknown,
) {
  const token = await getTenantAccessToken(cfg);
  const res = await fetch(`https://open.feishu.cn/open-apis${url}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(`Feishu API error: ${json.msg}`);
  }
  return json;
}

export async function sendFeishuMessage(
  cfg: any,
  chatId: string,
  content: string,
) {
  return feishuFetch(cfg, "/im/v1/messages?receive_id_type=chat_id", {
    receive_id: chatId,
    msg_type: "text",
    content: JSON.stringify({ text: content }),
  });
}

export async function editFeishuMessage(
  cfg: any,
  messageId: string,
  content: string,
) {
  return feishuFetch(cfg, `/im/v1/messages/${messageId}`, {
    msg_type: "text",
    content: JSON.stringify({ text: content }),
  });
}

export async function deleteFeishuMessage(
  cfg: any,
  messageId: string,
) {
  return feishuFetch(cfg, `/im/v1/messages/${messageId}/delete`, {});
}

export async function reactFeishuMessage(
  cfg: any,
  messageId: string,
  emoji: string,
) {
  return feishuFetch(cfg, `/im/v1/messages/${messageId}/reactions`, {
    reaction_type: emoji,
  });
}
