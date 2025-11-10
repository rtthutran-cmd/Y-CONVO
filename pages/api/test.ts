import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return res.status(200).json({ success: true, message: "POST works!" });
  }
  res.status(405).json({ error: "Use POST" });
}
