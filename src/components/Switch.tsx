const Switch = ({
  isOn,
  onToggle
}: {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
}) => {
  const toggleSwitch = () => {
    onToggle(!isOn); // Pass the new state to the parent
  };

  return (
    <div
      className={`w-10 m-3 h-6 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-secondary' : 'bg-neutral-300'}`}
      onClick={toggleSwitch}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-4' : 'translate-x-0'}`}
      ></div>
    </div>
  );
};

export default Switch;
