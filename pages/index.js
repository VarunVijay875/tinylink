import { useState, useEffect } from "react";
import Link from "next/link";
import { getBaseUrl } from "../lib/baseUrl";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load links.");
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setCreating(false);
      return;
    }

    setUrl("");
    setCode("");
    setCreating(false);
    fetchLinks();
  };

  const handleDelete = async (shortCode) => {
    if (!confirm(`Delete link "${shortCode}"?`)) return;

    try {
      const res = await fetch(`/api/links/${shortCode}`, {
        method: "DELETE",
      });

      if (res.status !== 204) {
        alert("Failed to delete link.");
        return;
      }

      fetchLinks();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleCopy = async (shortCode) => {
    const baseUrl = getBaseUrl();
    const shortUrl = `${baseUrl}/${shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied!");
    } catch (err) {
      alert("Copy failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">TinyLink</h1>
          <span className="text-xs text-slate-400">
            Simple URL shortener demo
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Create a new link</h2>

          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-3 md:flex-row md:items-center"
          >
            <div className="flex-1 space-y-1">
              <label className="text-xs text-slate-400">Target URL</label>
              <input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">
                Custom code (6–8 chars)
              </label>
              <input
                type="text"
                placeholder="optional"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full md:w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="mt-2 md:mt-5 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-sm font-medium"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>

          {error && (
            <p className="mt-2 text-sm text-red-400">Error: {error}</p>
          )}
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">All Links</h2>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-sm text-slate-400">No links yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Code
                    </th>
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Target URL
                    </th>
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Clicks
                    </th>
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Last Clicked
                    </th>
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Short URL
                    </th>
                    <th className="text-left px-3 py-2 border-b border-slate-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => {
                    const shortUrl = `${getBaseUrl()}/${link.code}`;

                    return (
                      <tr
                        key={link.code}
                        className="hover:bg-slate-900/70 transition-colors"
                      >
                        <td className="px-3 py-2 align-top">
                          <Link
                            href={`/code/${link.code}`}
                            className="text-sky-400 hover:text-sky-300 underline"
                          >
                            {link.code}
                          </Link>
                        </td>
                        <td className="px-3 py-2 align-top max-w-xs">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-slate-100 truncate hover:text-sky-300"
                          >
                            {link.url}
                          </a>
                        </td>
                        <td className="px-3 py-2 align-top">{link.clicks}</td>
                        <td className="px-3 py-2 align-top">
                          {link.lastClicked
                            ? new Date(link.lastClicked).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <input
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
                            readOnly
                            value={shortUrl}
                          />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(link.code)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(link.code)}
                              className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
