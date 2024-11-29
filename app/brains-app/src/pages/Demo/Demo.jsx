import React, { useState } from 'react';
import DynamicPanelLayout from '../../components/layout/DynamicPanelLayout/DynamicPanelLayout';
import { ELEMENT_TYPES, SPLIT_TYPES } from '../../components/layout/DynamicPanelLayout/types';
import Card from '../../components/base/Card/Card';
import Button from '../../components/base/Button/Button';
import { CardContent, CardContentList } from '../../components/base/CardContent/CardContent';
import Container from '../../components/base/Container/Container';
import './Demo.css';

const BaseComponentsContent = ({ loading, onLoadingClick }) => (
  <Card className="demo-card">
    <CardContentList
      items={[
        {
          title: 'Buttons',
          icon: '🔘',
          defaultExpanded: true,
          content: (
            <div className="demo-section">
              <h4>Button Variants</h4>
              <div className="button-grid">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <h4>Button Sizes</h4>
              <div className="button-grid">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>

              <h4>Button States</h4>
              <div className="button-grid">
                <Button loading={loading} onClick={onLoadingClick}>
                  {loading ? 'Loading...' : 'Loading State'}
                </Button>
                <Button disabled>Disabled</Button>
                <Button icon={<span>👋</span>}>With Icon</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          )
        },
        {
          title: 'Containers',
          icon: '📦',
          content: (
            <div className="demo-section">
              <h4>Container Sizes</h4>
              {['sm', 'default', 'lg', 'xl'].map(size => (
                <Container key={size} size={size} className="demo-container">
                  <div className="container-content">
                    {size.charAt(0).toUpperCase() + size.slice(1)} Container
                  </div>
                </Container>
              ))}
            </div>
          )
        }
      ]}
    />
  </Card>
);

const ContentViewPanel = () => (
  <Card className="demo-card" hoverable>
    <CardContent
      title="Main Content"
      icon="📝"
      badge="Active"
    >
      <div className="demo-content">
        <h3>Sample Content</h3>
        <p>This is a demonstration of the resizable panel layout system.</p>
        <p>Try dragging the dividers to resize panels.</p>
      </div>
    </CardContent>
  </Card>
);

const DetailsPanel = () => (
  <Card className="demo-card">
    <CardContentList
      items={[
        {
          title: 'Properties',
          icon: '⚙️',
          defaultExpanded: true,
          content: (
            <div className="properties-list">
              <div className="property-item">
                <span className="property-label">Name:</span>
                <span className="property-value">Demo Item</span>
              </div>
              <div className="property-item">
                <span className="property-label">Type:</span>
                <span className="property-value">Example</span>
              </div>
              <div className="property-item">
                <span className="property-label">Status:</span>
                <span className="property-value">Active</span>
              </div>
            </div>
          )
        },
        {
          title: 'Statistics',
          icon: '📊',
          content: (
            <div className="statistics-list">
              <div className="statistic-item">
                <span className="statistic-label">Views:</span>
                <span className="statistic-value">1,234</span>
              </div>
              <div className="statistic-item">
                <span className="statistic-label">Updates:</span>
                <span className="statistic-value">56</span>
              </div>
            </div>
          )
        }
      ]}
    />
  </Card>
);

const Demo = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const layoutConfig = {
    type: ELEMENT_TYPES.SPLIT,
    id: 'root',
    splitType: SPLIT_TYPES.VERTICAL,
    defaultSizes: [25, 75],
    children: [
      // Left column - Base Components panel (spans full height)
      {
        type: ELEMENT_TYPES.PANEL,
        id: 'base-components',
        title: 'Base Components',
        content: <BaseComponentsContent loading={loading} onLoadingClick={handleLoadingClick} />
      },
      // Right column - split horizontally for Content View and Details
      {
        type: ELEMENT_TYPES.SPLIT,
        id: 'right-column',
        splitType: SPLIT_TYPES.HORIZONTAL,
        children: [
          {
            type: ELEMENT_TYPES.PANEL,
            id: 'content-view',
            title: 'Content View',
            content: <ContentViewPanel />
          },
          {
            type: ELEMENT_TYPES.PANEL,
            id: 'details',
            title: 'Details',
            content: <DetailsPanel />
          }
        ]
      }
    ]
  };
  
  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="demo-header-content">
          <h1>Components Demo</h1>
          <p>Interactive demonstration of base components and layouts</p>
          <div className="demo-actions">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </header>
      
      <main className="demo-main">
        <DynamicPanelLayout 
          config={layoutConfig}
          className="demo-layout"
        />
      </main>
    </div>
  );
};

export default Demo;