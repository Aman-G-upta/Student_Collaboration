const RoleGate = ({ allow, children }) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !allow.includes(user.role)) return null;
    return children;
};

export default RoleGate;