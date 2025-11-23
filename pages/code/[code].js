import prisma from "../../lib/prisma";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { code } = context.params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      link: {
        ...JSON.parse(JSON.stringify(link)), // serialize Date
      },
    },
  };
}

export default function CodeStatsPage({ link }) {
  const shortUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${link.code}`
      : `/${link.code}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-lg">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Stats for: {link.code}</h1>
          <Link
            href="/"
            className="text-sm text-sky-400 hover:text-sky-300 underline"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Short URL</p>
            <div className="mt-1 flex items-center gap-2">
              <input
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
                readOnly
                value={shortUrl}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400">Target URL</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-sky-400 hover:text-sky-300 text-sm"
            >
              {link.url}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-400">Total Clicks</p>
              <p className="text-xl font-semibold mt-1">{link.clicks}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-400">Last Clicked</p>
              <p className="text-sm mt-1">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 mt-2">
            <p className="text-xs text-slate-400">Created At</p>
            <p className="text-sm mt-1">
              {new Date(link.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
