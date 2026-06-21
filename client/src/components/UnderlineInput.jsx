const UnderlineInput = ({ type = 'text', placeholder, value, onChange, id }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full py-3 px-0 bg-transparent border-0 border-b border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
    />
  );
};

export default UnderlineInput;
