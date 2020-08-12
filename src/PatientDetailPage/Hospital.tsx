import React from 'react';

import { HospitalEntry } from '../types';
import { Icon } from 'semantic-ui-react';

const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <>
      <Icon name='heartbeat' />
      Discharge: {entry.discharge.date} Criteria: {entry.discharge.criteria}
    </>
  );
};

export default Hospital;
