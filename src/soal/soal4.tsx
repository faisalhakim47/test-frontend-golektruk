import { useState, useRef, useEffect } from 'react'

// Soal Nomor 4
// Buatlah sebuah website yang menampilkan daftar pokemon yang di load dengan infinite scroll

const BASE_URL = 'https://pokeapi.co/api/v2'

async function fetchPokemon(offset: number, limit: number, abortSignal: AbortSignal) {
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`, {
    signal: abortSignal,
  })
  const data = await response.json();
  assertPokemonApiResp(data);
  return data;
}

type Pokemon = {
  name: string;
  url: string;
};

type PokemonApiResp = {
  count: number;
  results: Array<Pokemon>;
};

function assertPokemonApiResp(data: unknown): asserts data is PokemonApiResp {
  if (
    typeof data !== 'object' ||
    data === null ||
    'count' in data === false ||
    'results' in data === false ||
    !Array.isArray(data.results)
  ) {
    throw new Error('Invalid Pokemon API response');
  }
}

const Soal4 = () => {
  const [pokemonList, setPokemonList] = useState<Array<Pokemon>>([]);
  const [numOfPokemons, setNumOfPokemons] = useState<number | undefined>(undefined);

  const batchSize = 100;
  const [paginationOffset, setPaginationOffset] = useState(0);

  const loadMoreAnchorRef = useRef<HTMLParagraphElement | null>(null);

  // Observe load more anchor to trigger infinite scroll
  useEffect(() => {
    if (!(loadMoreAnchorRef.current instanceof HTMLElement)) return;
    if (typeof numOfPokemons !== 'number') return;

    const observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setPaginationOffset((paginationOffset) => {
            if (paginationOffset >= numOfPokemons) {
              return paginationOffset;
            }
            return paginationOffset + batchSize;
          });
          return;
        }
      }
    });

    observer.observe(loadMoreAnchorRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreAnchorRef, numOfPokemons]);

  // Fetch pokemon data
  useEffect(() => {
    const abortController = new AbortController();

    fetchPokemon(paginationOffset, batchSize, abortController.signal)
      .then((data) => {
        setNumOfPokemons(data.count);
        setPokemonList((prev) => [...prev, ...data.results]);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error(`Failed to fetch pokemon data: ${error.message}`);
      });

    return () => {
      abortController.abort();
    };
  }, [paginationOffset]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}>
      <div
        style={{
          flexGrow: 1,
          color: 'white',
          fontSize: '1.5em',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}>
        <h1
          style={{
            fontWeight: 'bolder',
          }}>
          Pokémon Infinite Scroll
        </h1>
        <ul>
          {pokemonList.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ul>
        <p ref={loadMoreAnchorRef}>{paginationOffset >= (numOfPokemons ?? 0) ? 'End of list' : 'Loading more Pokémon...'}</p>
      </div>
      <iframe
        src='/soal4.mp4'
        style={{
          height: '100vh',
          border: '1px solid white',
        }}></iframe>
    </div>
  )
}

export default Soal4

