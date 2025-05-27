import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `Duplicate field value: ${extractedMessage}. Please use another value!`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate field value',
    errorSources,
  };
};

export default handleDuplicateError;
