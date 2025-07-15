function Card({ title, value }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-value">{value}</div>
    </div>
  )
}

export default Card