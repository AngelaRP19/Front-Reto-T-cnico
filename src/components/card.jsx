function Card(props) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={props.image} alt={props.titulo} />
      </div>

      <div className="card-body">
        <span className="platform">{props.plataforma}</span>
        <h3>{props.titulo}</h3>
        <p className="price">{props.precio}</p>
      </div>
    </div>
  );
}

export default Card;
