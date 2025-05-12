
export const StylesBorder = (color, radius, borderWidth = 5) => ({
    position: "relative",
    padding: "2px", // Adjust padding for the gap between card and the border
    borderRadius: `${radius}px`,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='${radius}' ry='${radius}' stroke='%23${color}' stroke-width='${borderWidth}' stroke-dasharray='6%2c 14' stroke-linecap='square'/%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
});
export const StylesBorder2 = (color, radius, borderWidth = 5) => ({
    // position: "relative",
    // padding: "2px", // Adjust padding for the gap between card and the border
    borderRadius: `${radius}px`,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='${radius}' ry='${radius}' stroke='%23${color}' stroke-width='${borderWidth}' stroke-dasharray='6%2c 14' stroke-linecap='square'/%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
});

export const customStylesBorder = (color, radius = {}) => {
    const {
        topLeft = 0,
        topRight = 0,
        bottomRight = 0,
        bottomLeft = 0,
    } = radius;

    // Ensure color is formatted correctly (remove `#` if present, then encode it)
    const formattedColor = color.startsWith("#") ? color.slice(1) : color;
    const encodedColor = `%23${formattedColor}`; // Encode `#` as `%23`

    return {
        position: "relative",
        padding: "2px", // Adjust padding for the gap between card and the border
        borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3e%3crect width='100%25' height='100%25' fill='none'
            rx='${Math.max(topLeft, topRight, bottomRight, bottomLeft)}'
            ry='${Math.max(topLeft, topRight, bottomRight, bottomLeft)}'
            stroke='${encodedColor}' stroke-width='5' stroke-dasharray='6%2c14' stroke-linecap='square'/%3e%3c/svg%3e")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
    };
};


