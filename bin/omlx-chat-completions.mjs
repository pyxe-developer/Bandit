#!/usr/bin/env node
const DEFAULT_BASE_URL = "http://127.0.0.1:8000/v1";
const MODEL = "Qwen3.6-35B-A3B-MLX-8bit";
const REQUEST_TIMEOUT_MS = 180000;

const prompt = await readPrompt();
const baseUrl = (process.env.BANDIT_OMLX_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: "Bearer local"
  },
  body: JSON.stringify({
    model: MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are a read-only adversarial reviewer. Return only JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`oMLX chat completions failed with ${response.status}: ${body}`);
}

const payload = await response.json();
const content = payload?.choices?.[0]?.message?.content;
if (typeof content !== "string" || content.trim().length === 0) {
  throw new Error("oMLX chat completions response did not include message content");
}

process.stdout.write(JSON.stringify({ text: content }));

async function readPrompt() {
  if (process.argv[2] && process.argv[2] !== "-") {
    return process.argv[2];
  }

  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}
