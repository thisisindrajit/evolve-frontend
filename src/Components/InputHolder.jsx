const InputHolder = (props) => {
  return (
    <div className="flex flex-col w-full sm:w-10/12 my-2">
      <div className="flex justify-between font-bold text-xs uppercase text-evolve-green gap-8 leading-relaxed">
        <span>{props.title}</span>
        {props.isRequired ? (
          <span className="text-gray-300">REQUIRED</span>
        ) : (
          <span className="text-gray-300">OPTIONAL</span>
        )}
      </div>
      {props.children}
      {props.showInfo && (
        <div className="text-xs md:text-sm text-gray-300 text-justify leading-relaxed">{props.info}</div>
      )}
    </div>
  );
};

export default InputHolder;
