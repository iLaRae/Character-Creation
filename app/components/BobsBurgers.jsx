"use client";

import { useEffect, useState } from "react";

export default function BobBurgers() {
  const [burgers, setBurgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBurgers() {
      try {
        const res = await fetch("https://bobsburgers-api.herokuapp.com/burgerOfTheDay");
        if (!res.ok) throw new Error("Failed to fetch burgers");
        const data = await res.json();
        setBurgers(data.slice(0, 10)); // show first 10 burgers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBurgers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bob&apos;s Burgers — Burger of the Day</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {burgers.map((burger) => (
          <li
            key={burger.id}
            className="rounded-lg shadow bg-white hover:shadow-lg transition p-4"
          >
            <h2 className="font-semibold text-lg">{burger.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{burger.price}</p>
            <p className="text-sm">Season {burger.season}, Episode {burger.episode}</p>
            <a
              href={burger.episodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View Episode
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
