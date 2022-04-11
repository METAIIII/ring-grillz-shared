import { NextApiResponse } from 'next';

const handleError = (
  res: NextApiResponse,
  error: string | Error,
  status?: number
) => {
  console.error(JSON.stringify(error, null, 2));
  if (error instanceof Error) {
    res.status(status ?? 500).json({ error: error.message });
  } else {
    res.status(status ?? 500).json({ error });
  }
  return;
};

export default handleError;
