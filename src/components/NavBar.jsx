function NavBar({ activeView, setActiveView }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "search", label: "Search", icon: "🔍" },
    { id: "about", label: "About", icon: "ℹ️" },
  ]

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeView === item.id ? "active" : ""}`}
          onClick={() => setActiveView(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default NavBar
