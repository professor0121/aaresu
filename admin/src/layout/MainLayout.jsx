// src/layout/MainLayout.jsx
import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      {/* <Sidebar /> */}
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
