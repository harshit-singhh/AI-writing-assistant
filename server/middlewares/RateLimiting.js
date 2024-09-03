// RateLimiting.js

// Bucket size determines the maximum number of requests allowed in the bucket
const bucketSize = 10;

// Leak rate specifies how many requests can be processed per second
const leakRate = 2; // 2 requests per second

// Initialize an empty array to act as the bucket, which will hold the timestamps of requests
let bucket = [];

// Function to process requests
const processRequests = () => {
  // Get the current timestamp
  const currentTime = Date.now();

  // Remove timestamps from the bucket that are older than the time window defined by the leak rate
  // This effectively "leaks" old requests out of the bucket
  bucket = bucket.filter((timestamp) => timestamp > currentTime - 1000);
};

// Set up a timer to run the processRequests function at a fixed interval
// The interval is determined by dividing 1000 milliseconds (1 second) by the leak rate
// This ensures that requests are processed and leaked at a consistent rate
setInterval(() => {
  processRequests();
}, 1000 / leakRate); // Interval duration in milliseconds

//  the setInterval function will continuously run in the background, regardless of whether there are incoming requests or not.

// Middleware function for rate limiting
const rateLimitingMiddleware = (req, res, next) => {
  // Get the current timestamp
  const currentTime = Date.now();

  // Process the bucket to remove old requests before checking if it is full
  processRequests();

  // Check if the number of requests in the bucket has reached or exceeded the bucket size limit
  if (bucket.length >= bucketSize) {
    // If the bucket is full, respond with a 429 status code and an error message
    return res
      .status(429)
      .json({ error: "Server is busy, please try again later." });
  }

  // Add the current request timestamp to the bucket
  bucket.push(currentTime);

  // Call the next middleware or route handler in the stack
  next();
};

// Export the rate limiting middleware so it can be used in other files
module.exports = rateLimitingMiddleware;
