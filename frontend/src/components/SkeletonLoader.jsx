import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        skeletons.push(
          <div
            key={i}
            className="glass-card"
            style={{
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <div>
              <div
                className="skeleton"
                style={{ height: '24px', width: '70%', marginBottom: '16px' }}
              ></div>
              <div
                className="skeleton"
                style={{ height: '14px', width: '100%', marginBottom: '8px' }}
              ></div>
              <div
                className="skeleton"
                style={{ height: '14px', width: '90%', marginBottom: '8px' }}
              ></div>
              <div
                className="skeleton"
                style={{ height: '14px', width: '40%', marginBottom: '8px' }}
              ></div>
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div className="skeleton" style={{ height: '12px', width: '50%' }}></div>
                <div className="skeleton" style={{ height: '12px', width: '60%' }}></div>
              </div>
              <div className="skeleton" style={{ height: '40px', width: '100%' }}></div>
            </div>
          </div>
        );
      } else if (type === 'list') {
        skeletons.push(
          <div
            key={i}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '16px 24px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '20px', width: '35%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '12px', width: '20%' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="skeleton" style={{ height: '16px', width: '80px' }}></div>
              <div className="skeleton" style={{ height: '38px', width: '100px' }}></div>
            </div>
          </div>
        );
      }
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
}
