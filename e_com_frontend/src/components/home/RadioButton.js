import React from "react";

const RadioButton = ({ priceRanges, handleFilter }) => {

	// console.log("price ranges:", priceRanges);

	return (
					
        priceRanges.map((priceRange) => (
            <li className="list-unstyled" key={priceRange._id}>
                <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    value={priceRange.value}
                    onChange={() => handleFilter(priceRange.value)}
                    
                />
                <label className="form-check-label">{priceRange.name}</label>

            </li>
        ))
		
	)


};

export default RadioButton;
