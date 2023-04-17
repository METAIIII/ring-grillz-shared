import { NextApiResponse } from 'next';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}

const logError = (message: string) => {
  const now = new Date().toISOString();
  console.error(`[${now}] [ERROR] ${message}`);
};

export const handleApiError = (
  res: NextApiResponse,
  error: string | Error,
  status: number = 500
): Promise<never> => {
  console.log(error);
  const errorMessage = error instanceof Error ? error.message : `${JSON.stringify(error)}`;
  const response: ApiErrorResponse = {
    statusCode: status,
    message: errorMessage,
  };
  logError(errorMessage);
  return Promise.reject(response);
};
