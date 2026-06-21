import { NavLink, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineTicket, HiOutlineHeart, HiOutlineUser } from 'react-icons/hi2';

const navItems = [
  { path: '/home', icon: HiOutlineHome, id: 'nav-home' },
  { path: '/my-bookings', icon: HiOutlineTicket, id: 'nav-tickets' },
  { path: '/favorites', icon: HiOutlineHeart, id: 'nav-favorites' },
  { path: '/profile', icon: HiOutlineUser, id: 'nav-profile' }
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="sticky bottom-0 w-full bg-white border-t border-gray-100 z-[999]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              id={item.id}
              className="flex flex-col items-center justify-center w-14 h-14"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-400'}`}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
