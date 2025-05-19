import api from 'api';
import { useMemo, useState } from 'react';
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
  const route = useMemo(() => `/auth/${formType}`, [formType])
  const [loading, setLoading] = useState(false)

  const { handleSubmit, setError, ...formProps } = useForm();

  const onSubmit = handleSubmit((data) => {
    let isError = false
    formInputs.map((f, index) => {
      if (!data[f.name]) {
        setError(f.name, { message: `${f.title} is required` })
        isError = true
      }
    })
    if (isError) return
    setLoading(true)
    api.post(route, data)
      .then(res => res.data)
      .then(data => console.log(data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  });

  return { ...formProps, onSubmit, formInputs };
}
