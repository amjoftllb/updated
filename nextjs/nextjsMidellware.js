// pages/api/hello.js

// Middleware function
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Next.js API route handler
export default async function handler(req, res) {
  // Apply middleware
  await new Promise((resolve) => {
    logger(req, res, resolve);
  });

  // Handle the request
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello, world!' });
  } else if (req.method === 'POST') {
    res.status(200).json({ message: 'Posted!' });
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
