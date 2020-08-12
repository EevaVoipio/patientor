import React from 'react';

import { HealthCheckEntry } from '../types';
import { Icon } from 'semantic-ui-react';

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <>
      <Icon name='doctor' />
      Healthcheck rating: {entry.healthCheckRating}
    </>
  );
};

export default HealthCheck;
