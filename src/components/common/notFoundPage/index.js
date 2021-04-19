import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = React.memo(props => {
  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        <Link to="/">Go to Home </Link>
      </p>
    </div>
  );
});

export default NotFoundPage;
