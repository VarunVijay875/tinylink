import prisma from "../../../lib/prisma";

// Code must be 6-8 characters alphanumeric
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(links);
  }

  if (req.method === "POST") {
    const { url, code } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "invalid url" });
    }

    let shortCode = code;

    // If user entered a code, validate it
    if (shortCode) {
      if (!CODE_REGEX.test(shortCode)) {
        return res
          .status(400)
          .json({ error: "code must match [A-Za-z0-9]{6,8}" });
      }

      const exists = await prisma.link.findUnique({
        where: { code: shortCode },
      });

      if (exists) {
        return res.status(409).json({ error: "code already exists" });
      }
    } else {
      // Auto generate a code if none provided
      shortCode = Math.random().toString(36).substring(2, 10);
    }

    const newLink = await prisma.link.create({
      data: {
        url,
        code: shortCode,
      },
    });

    return res.status(201).json(newLink);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end();
}
