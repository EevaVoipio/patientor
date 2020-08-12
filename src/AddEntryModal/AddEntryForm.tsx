import React, { useState } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import {
  TextField,
  SelectField,
  NumberField,
  DiagnosisSelection,
  EntryOption,
  SelectEntryField,
} from '../AddPatientModal/FormField';
import {
  EntryOptions,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
} from '../types';
import { useStateValue } from '../state';
import EntryDetails from '../PatientDetailPage/EntryDetails';

export type EntryFormValues = {
  type: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
  discharge?: {
    date: string;
    criteria: string;
  };
  healthCheckRating?: HealthCheckRating;
};

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: EntryOption[] = [
  { value: 'Hospital', label: 'Hospital' },
  { value: 'HealthCheck', label: 'HealthCheck' },
  { value: 'OccupationalHealthcare', label: 'Occupational' },
];

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: 'Hospital',
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        discharge: {
          date: '',
          criteria: '',
        },
        sickLeave: {
          startDate: '',
          endDate: '',
        },
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (values.type === 'HealthCheck' && !values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        if (
          values.type === 'Hospital' &&
          (!values.discharge.date || !values.discharge.criteria)
        ) {
          errors.discharge = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className='form ui'>
            <SelectEntryField
              label='Type'
              name='type'
              options={entryTypeOptions}
            />
            <Field
              label='Description'
              placeholder='Description'
              name='description'
              component={TextField}
            />
            <Field
              label='Date'
              placeholder='YYYY-MM-DD'
              name='date'
              component={TextField}
            />
            <Field
              label='Specialist'
              placeholder='Specialist'
              name='specialist'
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label='Discharge date'
              placeholder='Discharge date'
              name='discharge.date'
              component={TextField}
            />
            <Field
              label='Discharge criteria'
              placeholder='Discharge criteria'
              name='discharge.criteria'
              component={TextField}
            />
            <Field
              label='Sick leave start date'
              placeholder='Sick leave start date'
              name='sickLeave.startDate'
              component={TextField}
            />
            <Field
              label='Sickleave end date'
              placeholder='Sickleave end date'
              name='sickLeave.endDate'
              component={TextField}
            />
            <Field
              label='healthCheckRating'
              name='healthCheckRating'
              component={NumberField}
              min={0}
              max={3}
            />
            <Grid>
              <Grid.Column floated='left' width={5}>
                <Button type='button' onClick={onCancel} color='red'>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <Button
                  type='submit'
                  floated='right'
                  color='green'
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
