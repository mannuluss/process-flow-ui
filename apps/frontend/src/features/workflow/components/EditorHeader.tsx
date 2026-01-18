import React from 'react';
import {
  Layout,
  Flex,
  Typography,
  Button,
  Avatar,
  Dropdown,
  theme,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/store/store';
import { resetSidePanel } from 'src/store/sidePanelSlice';

const { Header } = Layout;
const { Text, Title } = Typography;

export const EditorHeader: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const backAction = () => {
    dispatch(resetSidePanel());
    navigate('/home');
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#112218', // Matching mockup background
        borderBottom: `1px solid ${token.colorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        zIndex: 50,
      }}
    >
      {/* Left Section: Back, Title, Breadcrumbs */}
      <Flex align="center" gap={16}>
        <Button
          type="text"
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24 }}
            >
              arrow_back
            </span>
          }
          onClick={() => backAction()}
          style={{ color: token.colorTextSecondary }}
        />
        <div style={{ width: 1, height: 32, background: token.colorBorder }} />
        <Flex vertical>
          <Flex align="center" gap={8}>
            <span
              className="material-symbols-outlined"
              style={{ color: token.colorPrimary, fontSize: 20 }}
            >
              account_tree
            </span>
            <Title
              level={5}
              style={{ margin: 0, color: token.colorTextBase, lineHeight: 1 }}
            >
              Proceso de Aprobación Genérico
            </Title>
          </Flex>
          <Flex align="center" gap={8}>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              Mis Proyectos
            </Text>
            <Text style={{ fontSize: 12, color: token.colorBorder }}>•</Text>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              Editado hace 5 min
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Right Section: Save, Menu, User */}
      <Flex align="center" gap={12}>
        <Button
          type="primary"
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              save
            </span>
          }
          style={{
            backgroundColor: token.colorPrimary,
            color: token.colorBgBase,
            fontWeight: 'bold',
            boxShadow: 'none',
          }}
        >
          Guardar
        </Button>

        <Dropdown
          menu={{
            items: [
              {
                key: 'import',
                label: 'Importar JSON',
                icon: (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    file_upload
                  </span>
                ),
              },
              {
                key: 'export',
                label: 'Exportar JSON',
                icon: (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    file_download
                  </span>
                ),
              },
            ],
          }}
        >
          <Button
            type="text"
            icon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                more_vert
              </span>
            }
            style={{
              color: token.colorTextBase,
              backgroundColor: token.colorBorderSecondary,
            }}
          />
        </Dropdown>

        <div
          style={{
            width: 1,
            height: 32,
            background: token.colorBorder,
            margin: '0 8px',
          }}
        />

        <Avatar
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlVcKPlbJqg1OTpxFJ47ozi-UXs9RyQ6g0xglWPjQWD6LoIavxNGdeg7uUQFdvpcRufnjn43wSghG5Tgm4YJhBZEhErX4Voj_NtQuc2Oql9_Z5tuRzWVlcoYDbAOEC9u51Xv8afk0xPZGSD6jUZwoDPjcNt0evgVUSfOh8ZmMZr1ANW6APa0feRf19zd7VgIy1321uHVbJxAqtpMf9K3fULI8BrwskeVY6uOPq_Kb6DgOIXlIKnGoniprB-vZ5y7jMxcS_9gu0-lE"
          style={{
            border: `2px solid ${token.colorBorder}`,
            cursor: 'pointer',
          }}
        />
      </Flex>
    </Header>
  );
};
