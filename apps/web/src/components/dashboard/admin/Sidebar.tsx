import React from 'react';
import Link from 'next/link';
import { adminNav } from '../../../navigation/adminNav';

const AdminSidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="app-nav">
          {adminNav.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="app-nav-item">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;