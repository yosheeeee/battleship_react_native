import { useNavigation } from "@react-navigation/native";
import api from "api";
import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { authContext } from "~/store/useAuth";
import { InputDefinition } from "~/types/input";

type FormType = "login" | "registration";

type InputFieldsDefinitions = Record<FormType, InputDefinition[]>;

const inputFields: InputFieldsDefinitions = {
  login: [
    {
      title: "Email",
      keyboardType: "email-address",
      name: "email",
    },
    {
      title: "Password",
      keyboardType: "visible-password",
      name: "password",
    },
  ],
  registration: [
    {
      title: "Email",
      keyboardType: "email-address",
      name: "email",
    },
    {
      title: "Nickname",
      keyboardType: "default",
      name: "nickname",
    },
    {
      title: "Password",
      keyboardType: "visible-password",
      name: "password",
    },
  ],
};

export default function useAuthForm(formType: FormType) {
  const formInputs = useMemo(() => inputFields[formType], [formType]);
  const route = useMemo(() => `/auth/${formType}`, [formType]);
  const [loading, setLoading] = useState(false);
  const { login, isLogged } = useContext(authContext);
  const navigation = useNavigation();

  const { handleSubmit, setError, ...formProps } = useForm();

  useEffect(() => {
    if (isLogged) {
      console.log("should redirect");
      navigation.navigate("Main");
    }
  }, [isLogged]);

  const onSubmit = handleSubmit((data) => {
    let isError = false;
    formInputs.map((f, index) => {
      if (!data[f.name]) {
        setError(f.name, { message: `${f.title} is required` });
        isError = true;
      }
    });
    if (isError) return;
    setLoading(true);
    api.post(route, data)
      .then((res) => res.data)
      .then(({ token }) => {
        login(token);
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          const { data: { error, field }, errorType } = e.response.data;
          if (errorType === "field") {
            setError(field, { message: error });
          }
        } else if (e.request) {
          console.error("No response received. Request details:", e.request);
        } else if (e.message) {
          console.error("Error message:", e.message);
        }
      })
      .finally(() => setLoading(false));
  });

  return { ...formProps, onSubmit, formInputs, loading };
}
