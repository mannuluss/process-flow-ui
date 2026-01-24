import React from 'react';
import { Outlet, useNavigate, useLocation, useMatches } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setSidebarCollapsed } from '../store/configSlice';
import {
  Layout,
  Menu,
  Button,
  Input,
  Avatar,
  Breadcrumb,
  Flex,
  Typography,
  theme,
} from 'antd';
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  TableOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();

  const collapsed = useAppSelector(state => state.config.sidebarCollapsed);

  // Sync sidebar state with route metadata only on navigation
  React.useEffect(() => {
    const shouldCollapse = matches.some(
      match => (match.handle as any)?.sidebarCollapsed === true
    );
    dispatch(setSidebarCollapsed(shouldCollapse));
  }, [location.pathname]); // Only run on route change

  const onCollapse = (value: boolean) => {
    dispatch(setSidebarCollapsed(value));
  };

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: '/home',
      icon: <AppstoreOutlined />,
      label: 'Mis Flujos',
      onClick: () => navigate('/home'),
    },
    {
      key: '/templates',
      icon: <TableOutlined />,
      label: 'Plantillas',
    },
    {
      key: '/archived',
      icon: <FolderOpenOutlined />,
      label: 'Archivados',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={210}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="md"
        trigger={null} // We will use a custom trigger for better design
        style={{
          borderRight: `1px solid ${token.colorBorder}`,
          background: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          justify="space-between"
          style={{ height: '100%', padding: '16px' }}
        >
          <Flex vertical gap={24}>
            {/* Logo Area & Manual Toggle */}
            <Flex
              align="center"
              justify={collapsed ? 'center' : 'space-between'}
              style={{
                paddingLeft: collapsed ? '0' : '8px',
                transition: 'all 0.2s',
              }}
            >
              <Flex align="center" gap={12}>
                <DeploymentUnitOutlined
                  style={{
                    fontSize: collapsed ? '32px' : '28px',
                    color: token.colorPrimary,
                  }}
                />
                {!collapsed && (
                  <Text
                    strong
                    style={{ fontSize: '18px', whiteSpace: 'nowrap' }}
                  >
                    StateFlow
                  </Text>
                )}
              </Flex>
            </Flex>

            {/* Custom Toggle Button */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: collapsed ? '0 auto' : '0 0 0 auto',
              }}
            />

            {/* Navigation */}
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{
                background: 'transparent',
                borderRight: 'none',
              }}
            />
          </Flex>

          {/* Sidebar Footer */}
          {!collapsed && (
            <div
              style={{
                borderTop: `1px solid ${token.colorBorder}`,
                paddingTop: '16px',
              }}
            >
              <Button
                block
                type="primary"
                ghost
                style={{
                  background: `${token.colorPrimary}1A`, // 10% opacity
                  fontWeight: 'bold',
                }}
              >
                Upgrade Pro
              </Button>
            </div>
          )}
        </Flex>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Breadcrumbs */}
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <Text type="secondary">Workspace</Text>,
              },
              {
                title: <Text>Main Project</Text>,
              },
            ]}
          />

          {/* Center: Search */}
          <div style={{ flex: 1, maxWidth: '500px', margin: '0 24px' }}>
            <Input
              prefix={
                <SearchOutlined style={{ color: token.colorTextSecondary }} />
              }
              placeholder="Search flows, nodes, or templates..."
              style={{
                background: token.colorBgElevated,
                border: 'none',
                color: token.colorTextBase,
              }}
            />
          </div>

          {/* Right: Actions & Profile */}
          <Flex align="center" gap={16}>
            <Flex gap={8}>
              <Button
                type="text"
                icon={
                  <BellOutlined style={{ color: token.colorTextSecondary }} />
                }
              />
              <Button
                type="text"
                icon={
                  <QuestionCircleOutlined
                    style={{ color: token.colorTextSecondary }}
                  />
                }
              />
            </Flex>
            <div
              style={{
                width: '1px',
                height: '24px',
                background: token.colorBorder,
              }}
            />
            <Flex align="center" gap={12} style={{ cursor: 'pointer' }}>
              <Avatar
                icon={<UserOutlined />}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9fDXk2ne8opjEypIRq7ug6N8v7-qW-z3CjFAvrpKC62PyeKRnVsLXmtC2gMnhYRCxY79qxMGeAGQDkuiG3M0GW8StG65Ppc5MajUdm5Tu56Ye3W7i7bMxWrusAS7R4LdCH93DpAL6-hk6PsvFuHE6mp9doFcV-lzK3frkofgoM-pXGpbR8fS1_nGa9ejCl8jdNIybqUsbf-BO2a8Nn1A_KiphAowrbqgZc4fpIFH7VA1hb0-TceHOuQXT0vwAyE06XC4QvaYKRUU"
              />
              <Text strong>Jane Doe</Text>
            </Flex>
          </Flex>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
