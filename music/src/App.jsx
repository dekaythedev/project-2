import { useEffect, useRef, useState } from "react";
import Navbar from "./Components/Navbar.jsx";
import "./App.css";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [name, setName] = useState("Linkin Park"); // default search

  // Prevent StrictMode double-invoking initial effect from double-fetching
  const didInit = useRef(false);

  async function fetchData(term) {
    const url = `${apiUrl}/search?name=${encodeURIComponent(term)}`;
    console.log("Fetching data from:", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const data = await res.json();
    console.log("Fetched data:", data);
    return data;
  }

  async function handleSearch(term) {
    const cleaned = (term ?? "").trim();
    if (!cleaned) return;

    setName(cleaned);
    setIsLoading(true);

    try {
      const data = await fetchData(cleaned);
      setResults(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    handleSearch(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Empty / Loading shell (Navbar still visible)
  if (!results) {
    return (
      <div className="app">
        <Navbar onSearch={handleSearch} />

        <main className="page">
          <div className="emptyState">
            {isLoading ? (
              <>
                <div className="spinner" aria-hidden="true" />
                <p>Loading artist…</p>
              </>
            ) : (
              <>
                <p>No results yet.</p>
                <p className="muted">Try searching for an artist above.</p>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  const artistImg = results?.img?.[1]?.url || results?.img?.[0]?.url;
  const similar = results?.similarArtists?.similar?.results ?? [];

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />

      <main className="page">
        <section className="results">
          {/* LEFT COLUMN: Artist + Similar Artists */}
          <div className="leftCol">
            {/* Artist panel */}
            <section className="panel artistPanel">
              <div className="artistHeader">
                {artistImg ? (
                  <img
                    className="artistImg"
                    src={artistImg}
                    alt={`${results.name} artwork`}
                  />
                ) : (
                  <div className="artistImgFallback" aria-hidden="true" />
                )}

                <div className="artistMeta">
                  <p className="kicker">Artist</p>
                  <h2 className="artistTitle">{results.name}</h2>

                  <div className="statsRow">
                    <div className="stat">
                      <span className="statLabel">Followers</span>
                      <span className="statValue">
                        {results.followers?.total ?? "—"}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="statLabel">Popularity</span>
                      <span className="statValue">{results.popularity ?? "—"}</span>
                    </div>
                  </div>

                  <div className="ctaRow">
                    <a
                      className="btn btnPrimary"
                      href={results.spotifyUrl || results.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Listen on Spotify
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Artists panel (under artist info) */}
            <section className="listPanel similarPanel">
              <div className="panelHead">
                <h3 className="panelTitle">Similar Artists</h3>
                <span className="panelHint">{similar.length}</span>
              </div>

              <div className="similarGrid">
                {similar.map((artist, index) => {
                  const artistName =
                    typeof artist === "string" ? artist : artist?.name;

                  if (!artistName) return null;

                  return (
                    <button
                      key={`${artistName}-${index}`}
                      className="similarCard"
                      type="button"
                      onClick={() => handleSearch(artistName)}
                      title={`Search ${artistName}`}
                    >
                      <div className="similarLeft">
                        <div className="similarAvatar" aria-hidden="true">
                          {artistName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="similarMeta">
                          <span className="similarName">{artistName}</span>
                          <span className="similarSub">View artist</span>
                        </div>
                      </div>

                      <span className="similarAction" aria-hidden="true">›</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Albums + Top Tracks */}
          <section className="panel gridPanel">
            {/* Albums */}
            <section className="listPanel">
              <div className="panelHead">
                <h3 className="panelTitle">Albums</h3>
                <span className="panelHint">{results.albums?.length ?? 0}</span>
              </div>

              <div className="list">
                {results.albums?.map((album, i) => (
                  <div className="listItem" key={`${album}-${i}`}>
                    <span className="listText">{album}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Tracks */}
            <section className="listPanel">
              <div className="panelHead">
                <h3 className="panelTitle">Top Tracks</h3>
                <span className="panelHint">{results.topTracks?.length ?? 0}</span>
              </div>

              <div className="list">
                {results.topTracks?.map((track, i) => {
                  const trackUrl = results.trackUrls?.[i];

                  return (
                    <div className="listItem trackRow" key={`${track}-${i}`}>
                      <div className="trackLeft">
                        <span className="trackIndex">{i + 1}</span>
                        <span className="listText">{track}</span>
                      </div>

                      {trackUrl ? (
                        <a
                          className="btn btnGhost btnSmall"
                          href={trackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Listen
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
