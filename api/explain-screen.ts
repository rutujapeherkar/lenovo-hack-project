import { handleExplainScreenApi } from "../src/api/explain-screen/route";

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Method Not Allowed" },
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const result = await handleExplainScreenApi(body);

    for (const [key, val] of Object.entries(result.headers)) {
      res.setHeader(key, val);
    }
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: err?.message || "Internal server error" },
    });
  }
}
