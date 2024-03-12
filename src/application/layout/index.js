import { Menu } from 'antd';
import { UnorderedListOutlined, TabletOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = '/login';
  };

  return (
    <Menu
      style={{ width: "70px", height: '100vh', position: 'fixed', borderRight: "1px solid gray" }}
      mode="inline"
      defaultSelectedKeys={['1']}
    >
      <Menu.Item key="1" icon={<UnorderedListOutlined />}>
        <Link href="/dashboard" legacyBehavior>
          <a title="Dashboard">Dashboard</a>
        </Link>
      </Menu.Item>

      <Menu.Item key="3" icon={<TeamOutlined />}>
        <Link href="/teams" legacyBehavior>
          <a title="Teams">Teams</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="4" 
        icon={<LogoutOutlined />} 
        style={{ marginTop: "85vh", backgroundColor: "blue", color: "white", borderColor: "#ff4d4f", height: "5.5vh" }} 
        onClick={handleSignOut}>
          <a title="Sign Out">Sign Out</a> {/* For sign-out, consider handling differently as it's an action */}
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
