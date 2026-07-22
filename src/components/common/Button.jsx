const BASE = "font-nunito cursor-pointer";

const VARIANTS = {
  primary:
    "w-full border-none bg-main text-white py-3.5 text-base rounded-full font-bold mb-[18px] transition-colors duration-300 hover:bg-hover",
  outline:
    "w-full bg-transparent border-2 border-main text-main py-3 text-[15px] uppercase rounded-full font-bold transition-colors duration-300 hover:bg-main hover:text-white",
  oauth:
    "flex-1 border-none bg-snd-bg text-text py-3 text-[15px] rounded-full font-bold [transition:background-color_0.3s_ease,color_0.4s_ease] hover:bg-hover hover:text-white",
  link:
    "inline-block bg-transparent border-none p-0 text-main text-sm font-normal mb-6 transition-colors duration-300 hover:text-hover hover:underline",
};

function Button({ variant = "primary", type = "button", onClick, children, ...rest }) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
