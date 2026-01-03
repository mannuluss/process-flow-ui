import React from 'react';
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Flex,
  Tabs,
} from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateFlow = () => {
    // TODO: Call API to create flow, then navigate to its ID
    const newFlowId = 'new-flow-id';
    navigate(`/flow/${newFlowId}`);
  };

  const flows = [
    {
      id: 1,
      title: 'Onboarding Process',
      status: 'Active',
      description:
        'Main employee onboarding logic including document verification and welcome email triggers.',
      edited: '2h ago',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUSwvGHbgczZXzbxDmjy0C01A8vGYiFbBU80DoV4-H6zDdFdAToJv6X_mOV-ss1qU8cWi7WaHOCJHDuXKkLbz8ZQuOmqNUyJb94WqsfbDjwaJEpQN6lCTBwDH0nZadFMbsuxehsZo2DkRMfsRyBaKkm4Yz-SJY68VSmf1xRPilQBQqfk8-OBz_yBcA3Ppfnlo3a_mtWJGrYyWv0iIO-JA5TzBD0DTHfhH-6io9tOhFTHDhHGeqawq9awGKo8_WVTPhov_LXBggPaI',
      statusColor: 'success',
    },
    {
      id: 2,
      title: 'Payment Gateway',
      status: 'Draft',
      description:
        'Logic for Stripe integration, retry mechanisms, and error handling for failed transactions.',
      edited: '1d ago',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfWVLnHHb_2US2zwDZqjOuXv-pEJf7B5PE3D6hQQh8BU78Zc7prIgvH3-gKghE47tTmrMtnNBYKq2Gz4jHwJWhBOAE2CGQWIOK0ATuuWb64AbVhewTX5Hrxm4jCBmX78yVFBfI7s8iXZmf4-9jmymc6uWhXw7sN4oLSwJbdAsvtc9dPmsJkmTDKKTW1IwEtp0b9K0s8j1LO3Y68o7IE8kfNloJbM3xZ7b_TiHVKuEDTXe8zF2V8poW8f_5E4QuDimh-u3e0xVYCVg',
      statusColor: 'warning',
    },
    {
      id: 3,
      title: 'Email Automation',
      status: 'Paused',
      description: 'Weekly newsletter dispatch logic with A/B testing splits.',
      edited: '5d ago',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD3BWdFKfxHiNtF-eo5DiS9GRBSSjPFIJ6nfdimbeIaqtZ-bwrMwE98ez9K7iB_6luw3E9f48whZW5lrhJgEW5c2zSUKQ7p3B3bVqadJFFE7yBh24ah7qeptSWHp3i1M4qcfT8tyFljsgD3k4K4Jv6uQo68bq47S4zUBtoqunqaS9EQ47T1rNCbF7PxE2ioxdmQykVTsTsUg5tPKeE6PW8AfpKIpjy9FmE8ZKmddsP0LypoWqjgBkPRC9bDbkTiuNrtAru3WlRyVig',
      statusColor: 'default',
    },
    {
      id: 4,
      title: 'Support Bot',
      status: 'Active',
      description: 'Automated customer service responses for L1 tickets.',
      edited: '1w ago',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCpwbgEqwlJA9475FT035j_dRKXrRI-kdqotunq5sfZdoK2m_OKz7R8W-3vrhkIT7wlKQT6k1QOauP2_8le2-5RQIJ28RIbsSR7JK28jzpT6FImk9u3ugLdIlqHue-XO8kdR-nZ97l_dc-KDaPG2FB4tjBsC6pYDubDhcgtO1L8K27muZemHcGKVf_JIHwou0RZoPkgZEDxckm6-xvsguVxGI2CZ3zfiXqI-uO094DDoNqaD3potNaykv07pQ1FgQq7fXUyOQMZo6c',
      statusColor: 'success',
    },
  ];

  const items = [
    { key: 'all', label: 'All Flows' },
    { key: 'active', label: 'Active' },
    { key: 'drafts', label: 'Drafts' },
    { key: 'archived', label: 'Archived' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Heading */}
      <Flex
        justify="space-between"
        align="end"
        style={{ marginBottom: '32px' }}
      >
        <div>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            Mis Flujos
          </Title>
          <Paragraph
            style={{ color: '#93c8a8', margin: '8px 0 0 0', fontSize: '16px' }}
          >
            Manage and edit your existing process flows. Create logic diagrams
            for your automations.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateFlow}
          style={{
            background: '#30e87a',
            borderColor: '#30e87a',
            color: '#112117',
            fontWeight: 'bold',
          }}
        >
          Crear Nuevo Flujo
        </Button>
      </Flex>

      {/* Filters */}
      <Tabs
        defaultActiveKey="all"
        items={items}
        style={{ marginBottom: '24px', color: '#93c8a8' }}
        tabBarStyle={{ borderBottom: '1px solid #244732' }}
      />

      {/* Grid Layout */}
      <Row gutter={[24, 24]}>
        {flows.map(flow => (
          <Col xs={24} sm={12} lg={8} key={flow.id}>
            <Card
              hoverable
              style={{
                background: '#1a3224',
                borderColor: 'transparent',
                overflow: 'hidden',
                padding: 0,
              }}
              styles={{ body: { padding: '20px' } }}
              cover={
                <div
                  style={{
                    height: '160px',
                    position: 'relative',
                    backgroundImage: `url(${flow.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, #1a3224, transparent)',
                      opacity: 0.9,
                    }}
                  />
                  <div
                    style={{ position: 'absolute', top: '12px', right: '12px' }}
                  >
                    <Tag
                      color={flow.statusColor}
                      style={{ borderRadius: '12px', border: 'none' }}
                    >
                      {flow.status}
                    </Tag>
                  </div>
                </div>
              }
            >
              <Flex
                justify="space-between"
                align="start"
                style={{ marginBottom: '8px' }}
              >
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  {flow.title}
                </Title>
                <Button
                  type="text"
                  icon={<MoreOutlined style={{ color: '#93c8a8' }} />}
                />
              </Flex>
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{
                  color: '#93c8a8',
                  marginBottom: '16px',
                  minHeight: '44px',
                }}
              >
                {flow.description}
              </Paragraph>
              <Flex
                justify="space-between"
                align="center"
                style={{ borderTop: '1px solid #244732', paddingTop: '16px' }}
              >
                <Avatar.Group>
                  <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZMnWFy2K4KcEw_nhh8Kw_9dj8QeG5f3bDWspzurxUFVOx3pvMblnq6htnRW9nTRAqkDNOvyimCKHO1WucOZhd-P9fIO4kgXmMw5-3lN8fas_DG7l61Q-OXZu4csAcmoAQro1c-2JkMm9TXq1i7W3HBmeGreY3X3nHx6apaQifptMqRJOGtirmGK3-ndgfb4Y1_xnkJnRRjmDW_vtSsNPdwz06DtqW9-zjRl5-gcecAzblSpKhKfiri3IOfoTf9ct5hxMvf2C8xE" />
                </Avatar.Group>
                <Text style={{ color: '#93c8a8', fontSize: '12px' }}>
                  Edited {flow.edited}
                </Text>
              </Flex>
            </Card>
          </Col>
        ))}

        {/* Create New Flow Placeholder Card */}
        <Col xs={24} sm={12} lg={8}>
          <Button
            type="dashed"
            onClick={handleCreateFlow}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              background: 'transparent',
              borderColor: '#244732',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#244732',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusOutlined style={{ fontSize: '24px', color: '#30e87a' }} />
            </div>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              Create New Flow
            </Title>
            <Text style={{ color: '#93c8a8' }}>Start from scratch</Text>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
