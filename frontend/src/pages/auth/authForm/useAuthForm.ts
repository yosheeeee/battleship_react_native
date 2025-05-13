import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { InputDefinition } from '~/types/input';

type FormType = 'login' | 'registration';

type InputFieldsDefinitions = Record<FormType, InputDefinition[]>;

const inputFields: InputFieldsDefinitions = {
  login: [
    {
      title: 'Email',
      keyboardType: 'email-address',
      name: 'email',
    },
    {
      title: 'Password',
      keyboardType: 'visible-password',
      name: 'password',
    },
  ],
  registration: [
    {
      title: 'Email',
      keyboardType: 'email-address',
      name: 'email',
    },
    {
      title: 'Nickname',
      keyboardType: 'default',
      name: 'nickname',
    },
    {
      title: 'Password',
      keyboardType: 'visible-password',
      name: 'password',
    },
  ],
};

export default function useAuthForm(formType: FormType) {
  const formInputs = useMemo(() => inputFields[formType], [formType]);

  const { handleSubmit, ...formProps } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return { ...formProps, onSubmit, formInputs };
}
