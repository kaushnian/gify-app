'use client';

import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

const API_KEY = `pToF9vgGtxRuCD192XkxmfWlB0CelCQb`;
const GIFS_NUMBER = 1000;

export default function Home() {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  async function getGifs(offst: number) {
    const url = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}&offset=${offst}&limit=${GIFS_NUMBER}`;

    const response = await fetch(url);
    const gifsList = await response.json();

    setTotal(Math.ceil(gifsList.pagination.total_count / GIFS_NUMBER));
    setGifs(gifsList.data);
  }

  function changeQuery(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function prev() {
    const newOffset = offset - GIFS_NUMBER;
    if (newOffset < 0) return;

    getGifs(newOffset);
    setOffset(newOffset);
  }

  function next() {
    const newOffset = offset + GIFS_NUMBER;
    getGifs(newOffset);
    setOffset(newOffset);
  }

  return (
    <>
      <input value={query} onChange={changeQuery} />
      <button onClick={() => getGifs(offset)}>Load gifs</button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {gifs.map(({ images: { fixed_height } }, index) => (
          <div key={index}>
            <Image
              src={fixed_height.url}
              width={fixed_height.width}
              height={fixed_height.height}
              alt=""
            />
          </div>
        ))}
      </div>

      <div>
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>

      <div>
        <strong>Page number: {offset / GIFS_NUMBER + 1}</strong>
        <p>Total count: {total}</p>
      </div>
    </>
  );
}
