// app/bobs/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function BobsCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch("/api/bobs-api");
        if (!res.ok) throw new Error("Failed to fetch characters");
        const data = await res.json();
        setCharacters(data.slice(0, 10)); // show first 10 characters
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bob&apos;s Burgers Characters</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((char) => (
          <li
            key={char.id}
            className="rounded-lg shadow bg-white hover:shadow-lg transition p-3"
          >
            <img
              src={char.image}
              alt={char.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h2 className="font-semibold text-lg">{char.name}</h2>
            <p className="text-sm text-gray-600">{char.occupation}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
