function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          ☰
        </button>

        <h1>SindhuGPT</h1>
      </div>

      <button className="share-btn">
        Share
      </button>
    </header>
  );
}

export default Header;