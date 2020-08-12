import React from 'react';

import { Entry } from '../types';
import Hospital from './Hospital';
import HealthCheck from './HealthCheck';
import OccupationalHealthcare from './OccupationalHealthcare';
import { assertNever } from '../utils';
import { useStateValue } from '../state';

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  const entryType = () => {
    switch (entry.type) {
      case 'Hospital':
        return <Hospital entry={entry} />;
      case 'HealthCheck':
        return <HealthCheck entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcare entry={entry} />;
      default:
        return assertNever(entry);
    }
  };
  return (
    <div>
      <div>
        <h3>
          {entry.date} {entryType()}
        </h3>
      </div>
      <i>{entry.description}</i>
      <ul>
        {entry.diagnosisCodes !== undefined &&
          entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses[code] !== undefined && diagnoses[code].name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EntryDetails;
