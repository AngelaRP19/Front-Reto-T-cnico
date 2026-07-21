import "../../styles/button.css";

function Button({ variant = "primary", type = "button", onClick, children, ...rest }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
