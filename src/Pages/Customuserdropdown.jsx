import React, { useEffect, useState } from "react";



const CustomDropdown = ({
  options,
  placeholder,
  onSelectionChange,
  filteruser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Preload selected options based on filteruser when it changes
  useEffect(() => {
    if (filteruser) {
      setSelectedOptions(filteruser);
    }
  }, [filteruser]);

  // Handle option click
  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.some(
      (selected) => selected._id === option._id
    );
    const newSelections = isSelected
      ? selectedOptions.filter((item) => item._id !== option._id)
      : [...selectedOptions, option];

    setSelectedOptions(newSelections);
    onSelectionChange(newSelections); // Notify parent about changes
  };

  // Filter options
  const filteredOptions = options?.filter(
    (option) => option?.firstname?.trim() !== "" || option?.name?.trim() !== ""
  );

  return (
    <div className="custom-dropdown">
      {/* Dropdown Header */}
      <div className="dropdown-header border-2" onClick={toggleDropdown}>
        {selectedOptions.length > 0
          ? selectedOptions
              .map((opt) => opt.firstname || opt?.name)
              .join(", ")
          : placeholder}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-options">
            {filteredOptions.map((option) => {
              const isChecked = selectedOptions.some(
                (selected) => selected._id === option._id
              );
              return (
                <div
                  key={option._id}
                  className="dropdown-option"
                  onClick={() => handleOptionClick(option)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                  />
                  <span className="text-[white] ms-1">
                    {option?.firstname + ' ' + option?.lastname} {`(${option?.VisaDetail})`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

