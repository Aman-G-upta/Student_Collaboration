import Sidebar from "./Sidebar";
import MobileTopbar from "./MobileTopbar";

const Layout = ({ children }) => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
            <MobileTopbar />
            {children}
        </div>
    </div>
);

export default Layout;