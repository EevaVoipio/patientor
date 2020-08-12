import React from 'react';

import { OccupationalHealthcareEntry } from '../types';
import { Icon } from 'semantic-ui-react';

const OccupationalHealthcare: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <>
      <Icon name='stethoscope' />
      {entry.employerName} Sick leave:{' '}
      {entry.sickLeave && entry.sickLeave.startDate}-
      {entry.sickLeave && entry.sickLeave.endDate}
    </>
  );
};

export default OccupationalHealthcare;
