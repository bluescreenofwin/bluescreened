import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link href="/" className="navbar-brand">Microblog</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link href="/posts" className="nav-link">Posts</Link></li>
              <li className="nav-item"><Link href="/tools" className="nav-link">Tools</Link></li>
              <li className="nav-item"><Link href="/rss" className="nav-link">RSS</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mt-4">{children}</main>
    </>
  );
}
