import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { MoltbotConfig } from "../../config/config.js";
import {
  sendFeishuMessage,
  editFeishuMessage,
  deleteFeishuMessage,
  reactFeishuMessage,
} from "../../feishu/actions.js";
import {
  createActionGate,
  jsonResult,
  readStringParam,
} from "./common.js";

export async function handleFeishuAction(
  params: Record<string, unknown>,
  cfg: MoltbotConfig,
): Promise<AgentToolResult<unknown>> {
  const action = readStringParam(params, "action", { required: true });
  const isActionEnabled = createActionGate(cfg.channels?.feishu?.actions);

  if (action === "sendMessage") {
    if (!isActionEnabled("sendMessage")) {
      throw new Error("Feishu sendMessage is disabled.");
    }
    const chatId = readStringParam(params, "chatId", { required: true });
    const content = readStringParam(params, "content", { required: true });

    const result = await sendFeishuMessage(cfg, chatId, content);
    return jsonResult({ ok: true, result });
  }

  if (action === "editMessage") {
    if (!isActionEnabled("editMessage")) {
      throw new Error("Feishu editMessage is disabled.");
    }
    const messageId = readStringParam(params, "messageId", { required: true });
    const content = readStringParam(params, "content", { required: true });

    await editFeishuMessage(cfg, messageId, content);
    return jsonResult({ ok: true });
  }

  if (action === "deleteMessage") {
    if (!isActionEnabled("deleteMessage")) {
      throw new Error("Feishu deleteMessage is disabled.");
    }
    const messageId = readStringParam(params, "messageId", { required: true });

    await deleteFeishuMessage(cfg, messageId);
    return jsonResult({ ok: true });
  }

  if (action === "react") {
    if (!isActionEnabled("reactions")) {
      throw new Error("Feishu reactions are disabled.");
    }
    const messageId = readStringParam(params, "messageId", { required: true });
    const emoji = readStringParam(params, "emoji", { required: true });

    await reactFeishuMessage(cfg, messageId, emoji);
    return jsonResult({ ok: true, added: emoji });
  }

  throw new Error(`Unsupported Feishu action: ${action}`);
}
