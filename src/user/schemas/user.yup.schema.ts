import * as yup from 'yup';

export const newUserSchema = yup.object({
  identificationNumber: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  history: yup.string().notRequired(),
});

export interface NewUser extends yup.InferType<typeof newUserSchema> {
  stripUnknown: true;
}
