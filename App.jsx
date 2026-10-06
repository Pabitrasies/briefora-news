import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Menu, Moon, Newspaper, Search, Sun, X } from "lucide-react";
import CategoryBar from "./components/CategoryBar";
import EmptyState from "./components/EmptyState";
import NewsCard from "./components/NewsCard";
import { fetchNews } from "./services/newsService";
import { formatLongDate } from "./utils/date";

const today = new Date().toISOString().slice(0, 10);

export default function App() {
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem("briefora-bookmarks") || "[]"));
  const [dark, setDark] = useState(() => localStorage.getItem("briefora-theme") === "dark");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("briefora-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("briefora-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchNews({ date, category: category === "Saved" ? "All" : category, query })
      .then((items) => {
        if (!cancelled) setArticles(items);
      })
      .catch(() => {
        if (!cancelled) {
          setArticles([]);
          setError("Unable to load live news. Check your API endpoint.");
        }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [date, category, query]);

  const visibleArticles = useMemo(
    () => category === "Saved" ? articles.filter((article) => bookmarks.includes(article.id)) : articles,
    [articles, category, bookmarks]
  );

  const featured = visibleArticles[0];
  const remaining = visibleArticles.slice(1);

  function submitSearch(event) {
    event.preventDefault();
    setQuery(searchInput);
  }

  function toggleBookmark(id) {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className="brand">
            <div className="brand-mark"><Newspaper size={21} /></div>
            <div>
              <div className="brand-name">Briefora</div>
              <div className="brand-tagline">Daily news. Clearly explained.</div>
            </div>
          </div>

          <form className="search-box" onSubmit={submitSearch}>
            <Search size={18} />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search news..."
              aria-label="Search news"
            />
          </form>

          <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">YOUR DAILY BRIEFING</span>
            <h1>Know what matters.<br /><em>In minutes.</em></h1>
            <p>Concise stories, important keywords and simple vocabulary—designed for fast, informed reading.</p>
          </div>
          <div className="date-control">
            <CalendarDays size={19} />
            <label htmlFor="news-date">Browse date</label>
            <input id="news-date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
          </div>
        </section>

        <div className={menuOpen ? "mobile-category open" : "mobile-category"}>
          <CategoryBar active={category} onChange={(value) => { setCategory(value); setMenuOpen(false); }} />
        </div>
        <div className="desktop-category">
          <CategoryBar active={category} onChange={setCategory} />
        </div>

        <section className="content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EDITION</span>
              <h2>{formatLongDate(date)}</h2>
            </div>
            <span className="story-count">{visibleArticles.length} stories</span>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map((item) => <div className="skeleton" key={item} />)}
            </div>
          ) : visibleArticles.length === 0 ? (
            <EmptyState savedView={category === "Saved"} />
          ) : (
            <>
              <div className="news-grid featured-grid">
                <NewsCard
                  article={featured}
                  featured
                  saved={bookmarks.includes(featured.id)}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
              <div className="news-grid">
                {remaining.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    saved={bookmarks.includes(article.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer>
        <div><strong>Briefora</strong> — Daily news, clearly explained.</div>
        <div>Demo content is replaceable through the news service API layer.</div>
      </footer>
    </div>
  );
}
