import "../../styles/form-input.css";

function FormInput({ id, label, type = "text", placeholder, value, onChange, ...rest }) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}

export default FormInput;
