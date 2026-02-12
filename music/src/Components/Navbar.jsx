import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import "./Navbar.css";

export default function Navbar({ onSearch }) {
  const { user, login, logout } = useAuth();
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    onSearch(term);        // ✅ sends it up to App.jsx
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {/* Left: Brand */}
        <div className="topbar__brand">
          <div className="topbar__badge" aria-hidden="true">♪</div>
          <div className="topbar__brandText">
            <div className="topbar__title">Music Discovery</div>
            <div className="topbar__subtitle">Find artists, albums & vibes</div>
          </div>
        </div>

        {/* Center: Big Search */}
        <form className="topbar__search" onSubmit={handleSubmit} role="search">
          <span className="topbar__searchIcon" aria-hidden="true">⌕</span>
          <input
            className="topbar__searchInput"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search artists, tracks, albums..."
            aria-label="Search"
          />
          {query.length > 0 && (
            <button
              type="button"
              className="topbar__clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button className="topbar__go" type="submit">
            Search
          </button>
        </form>

        {/* Right: User / Actions */}
        <div className="topbar__actions">
          {user ? (
            <>
              <div className="topbar__user">
                <div className="topbar__avatar" aria-hidden="true">
                  {user.name?.slice(0, 1)?.toUpperCase() || "U"}
                </div>
                <div className="topbar__userText">
                  <div className="topbar__userName">{user.name}</div>
                  <div className="topbar__userMeta">Logged in</div>
                </div>
              </div>

              <button className="btn btn--ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => login({ id: "6969", name: "Dekay" })}
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
