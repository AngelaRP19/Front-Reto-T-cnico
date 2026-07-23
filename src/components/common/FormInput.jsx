function FormInput({ id, label, type = "text", placeholder, value, onChange, ...rest }) {
  return (
    <div className="w-full">
      <label
        className="block text-xs font-bold tracking-[0.5px] uppercase text-text opacity-70 mb-2 transition-colors duration-400"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full px-4 py-3 rounded-[10px] border border-snd-bg bg-snd-bg text-text text-[15px] font-nunito mb-4 [transition:border-color_0.3s_ease,background-color_0.4s_ease,color_0.4s_ease] focus:outline-none focus:border-main"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}

export default FormInput;
