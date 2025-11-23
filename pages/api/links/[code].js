import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { code } = req.query;

  // GET /api/links/:code
  if (req.method === "GET") {
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({ error: "not found" });
    }

    return res.status(200).json(link);
  }

  // DELETE /api/links/:code
  if (req.method === "DELETE") {
    const exists = await prisma.link.findUnique({
      where: { code },
    });

    if (!exists) {
      return res.status(404).json({ error: "not found" });
    }

    await prisma.link.delete({
      where: { code },
    });

    return res.status(204).end();
  }

  // Unsupported methods
  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
