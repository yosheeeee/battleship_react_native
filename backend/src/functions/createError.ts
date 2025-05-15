export enum ErrorTypes {
  FIELD,
  SERVER,
}

interface FieldError {
  type: ErrorTypes.FIELD;
  field: string;
  error: string;
}

interface ServerError {
  type: ErrorTypes.SERVER;
  error: string;
}

type ErrorType = FieldError | ServerError;
export default function createError(error: ErrorType) {
  switch (error.type) {
    case ErrorTypes.FIELD:
      return {
        errorType: "field",
        data: {
          field: error.field,
          error: error.error,
        },
      };
      break;
    case ErrorTypes.SERVER:
      return {
        errorType: "server",
        data: {
          error: error.error,
        },
      };
      break;
    default:
      return {
        message: "error",
      };
  }
}
