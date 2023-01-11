import React from "react";

const Button = ({ title, onClickFunc, isLoading = false, children, style }) => {
	return (
		<button onClick={onClickFunc} disabled={isLoading} style={style}>
			{isLoading ? <>{" Loading"}</> : title}
			{children}
		</button>
	);
};

export default Button;
