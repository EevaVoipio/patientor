import React, { useState } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import {
  TextField,
  NumberField,
  DiagnosisSelection,
  EntryOption,
  SelectEntryField,
} from '../AddPatientModal/FormField';
import { HealthCheckRating } from '../types';
import { useStateValue } from '../state';

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
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const [type, setType] = useState('Hospital');

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
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: '',
        },
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const invalidDateFormat = 'Date format is invalid';
        const errors: { [field: string]: string } = {};
        setType(values.type);
        if (!values.date) {
          errors.date = requiredError;
        }
        if (values.date && !values.date.match(dateRegex)) {
          errors.date = invalidDateFormat;
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
        if (values.type === 'OccupationalHealthcare' && !values.employerName) {
          errors.employerName = requiredError;
        }
        if (
          values.type === 'Hospital' &&
          values.discharge.date &&
          !values.discharge.date.match(dateRegex)
        ) {
          errors['discharge.date'] = invalidDateFormat;
        }
        if (
          values.type === 'OccupationalHealthcare' &&
          values.sickLeave.startDate &&
          !values.sickLeave.startDate.match(dateRegex)
        ) {
          errors['sickLeave.startDate'] = invalidDateFormat;
        }
        if (
          values.type === 'OccupationalHealthcare' &&
          values.sickLeave.endDate &&
          !values.sickLeave.endDate.match(dateRegex)
        ) {
          errors['sickLeave.endDate'] = invalidDateFormat;
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
            {type === 'Hospital' && (
              <Field
                label='Discharge date'
                placeholder='Discharge date'
                name='discharge.date'
                component={TextField}
              />
            )}
            {type === 'Hospital' && (
              <Field
                label='Discharge criteria'
                placeholder='Discharge criteria'
                name='discharge.criteria'
                component={TextField}
              />
            )}
            {type === 'OccupationalHealthcare' && (
              <Field
                label='Employer name'
                placeholder='Employer name'
                name='employerName'
                component={TextField}
              />
            )}
            {type === 'OccupationalHealthcare' && (
              <Field
                label='Sick leave start date'
                placeholder='Sick leave start date'
                name='sickLeave.startDate'
                component={TextField}
              />
            )}
            {type === 'OccupationalHealthcare' && (
              <Field
                label='Sickleave end date'
                placeholder='Sickleave end date'
                name='sickLeave.endDate'
                component={TextField}
              />
            )}
            {type === 'HealthCheck' && (
              <Field
                label='healthCheckRating'
                name='healthCheckRating'
                component={NumberField}
                min={0}
                max={3}
              />
            )}
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
