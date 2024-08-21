import HamburgerMenu from "./HamburgerMenu";

const SideNav = () => {
    return (
        // <aside classNameName='bg-orange-300 fixed left-0 top-0 h-screen w-32 z-10'>
        <aside className='bg-orange-300 row-span-3'>
            <HamburgerMenu />
        </aside>
    );
}

export default SideNav;
