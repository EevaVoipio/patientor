import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

import { Patient, Gender, Entry } from '../types';
import { useStateValue, setPatientDetails, updatePatient } from '../state';
import { apiBaseUrl } from '../constants';
import { assertNever } from '../utils';
import EntryDetails from './EntryDetails';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patientDetails }, dispatch] = useStateValue();
  const patient = patientDetails[id];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      const updatedPatient = {
        ...patient,
        entries: patient.entries
          ? patient.entries.concat(newEntry)
          : [newEntry],
      };
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };
  React.useEffect(() => {
    if (!patient) {
      const fetchPatientDetails = async () => {
        try {
          const { data: patientDetailsFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(setPatientDetails(patientDetailsFromApi));
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatientDetails();
    }
  }, [patient, id, dispatch]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Female:
        return 'venus';
      case Gender.Male:
        return 'mars';
      case Gender.Other:
        return 'heart';
      default:
        return assertNever(gender);
    }
  };

  return (
    <div className='App'>
      <h2>
        {patient.name} <Icon name={genderIcon(patient.gender)} />
      </h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <h3>Entries</h3>
      {patient.entries !== undefined &&
        patient.entries.map((entry) => {
          return <EntryDetails key={entry.id} entry={entry} />;
        })}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetailPage;
