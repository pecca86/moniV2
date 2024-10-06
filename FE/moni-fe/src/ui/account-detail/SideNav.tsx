import HamburgerMenu from "./HamburgerMenu";
import DesktopMenu from "./DesktopMenu";

const SideNav = () => {
    return (
        <div className="absolute lg:relative">
            <DesktopMenu />
            <HamburgerMenu />
        </div>
    );
}

export default SideNav;
