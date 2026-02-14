function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #22c55e, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Hello MTR/STR Finance World! 🏠
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: '#666',
        marginBottom: '2rem'
      }}>
        Spring Sparrow Financial Advisor Platform
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        fontSize: '1rem',
        color: '#888'
      }}>
        <span>🏡 Robin's Roost</span>
        <span>🕊️ Dove's Den</span>
        <span>🏟️ Stadium District</span>
      </div>

      <p style={{ 
        marginTop: '2rem', 
        fontSize: '0.875rem', 
        color: '#999'
      }}>
        Keeya's Business Intelligence Dashboard
      </p>
    </div>
  );
}

export default App;