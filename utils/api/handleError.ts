import { NextApiResponse } from 'next';

const handleError = (res: NextApiResponse, error: string | Error, status?: number) => {
  if (error instanceof Error) {
    console.log(error.message);
    res.status(status ?? 500).json({ error: error.message });
  } else {
    const jsonError = JSON.stringify(error, null, 2);
    if (jsonError === '{}') {
      console.log(`${error}`);
    } else {
      console.log(jsonError);
    }
    res.status(status ?? 500).json({ error: `${error}` });
  }
  return;
};

export default handleError;
