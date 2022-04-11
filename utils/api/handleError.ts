import { NextApiResponse } from 'next';

const handleError = (res: NextApiResponse, error: Error | string | any) => {
  console.log(JSON.stringify(error, null, 2));
  if (error instanceof Error) {
    console.log(error.stack);
    res.status(200).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Unknown error occurred." });
  }
  return;
};

export default handleError;
