import { useEffect, useMemo, useState } from "react";

export default function Soal3() {
  /**
   * ? 1. hilangkan semua error dan deskripsikan apa penyebab error.
   * ? 2. tampilkan data yang di panggil dari api tersebut...
   */

  return <SearchComponent />;
}

/**
 * Ada konteks yang masih kurang jelas pada soal ini.
 * Pada komponen ini terdapat pencarian text yang saya asumsikan adalah pencarian nama foto.
 * Namun, endpoint api tersebut tidak menyediakan query pencarian, yang ada adalah endpoint untuk mendapatkan data foto berdasarkan id.
 * Jadi, solusi yang saya ambil:
 * - Tampilkan semua data foto yang ada pada endpoint tersebut.
 * - Fitur pencarian akan dilakukan pada frontend.
 */
function SearchComponent() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Array<Photo>>([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch('https://jsonplaceholder.typicode.com/photos', { method: 'GET', signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        validatePhotosResponse(data);
        setResults(data);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter((result) => result.title.includes(search));
  }, [results, search]);

  return (
    <div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      <ul>
        {filteredResults.map((result) => (
          <li key={result.id} style={{ color: "white" }}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

type Photo = {
  id: number;
  title: string;
}

function validatePhotosResponse(data: unknown): asserts data is Array<Photo> {
  if (!Array.isArray(data)) throw new Error("Data is not an array");
  for (const item of data) {
    if (typeof item.id !== "number") throw new Error("ID is not a number");
    if (typeof item.title !== "string") throw new Error("Title is not a string");
  }
}
