// Import the necessary modules for testing
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken'); // Make sure this path matches your file structure

// Mock the request and response objects
let req;
let res;
const next = jest.fn();

// Setup for mocking JWT verification and response objects before each test
beforeEach(() => {
  req = { cookies: {} };
  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  process.env.JWT_SECRET_KEY = 'test_secret_key';
  jwt.verify = jest.fn();
  next.mockClear();
});

describe('verifyToken middleware', () => {
  it('should return 401 if token is not provided', () => {
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'unauthorized' });
  });

  it('should return 401 if token is invalid', () => {
    req.cookies.auth_token = 'invalid_token';
    jwt.verify.mockImplementation(() => { throw new Error(); });
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'unauthorized' });
  });

  it('should call next() if token is valid', () => {
    const validToken = jwt.sign({ userId: 'test_user_id' }, process.env.JWT_SECRET_KEY);
    req.cookies.auth_token = validToken;
    jwt.verify.mockImplementation(() => ({ userId: 'test_user_id' }));
    verifyToken(req, res, next);
    expect(req.userId).toBe('test_user_id');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is expired', () => {
    req.cookies.auth_token = 'expired_token';
    jwt.verify.mockImplementation(() => { throw new jwt.TokenExpiredError(); });
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'session expired' });
  });

  // Assuming tokens can also be provided in headers for this test case
  it('should validate token provided in the header', () => {
    const validToken = jwt.sign({ userId: 'test_user_id' }, process.env.JWT_SECRET_KEY);
    req.headers = { authorization: `Bearer ${validToken}` };
    jwt.verify.mockImplementation(() => ({ userId: 'test_user_id' }));
    verifyToken(req, res, next);
    expect(req.userId).toBe('test_user_id');
    expect(next).toHaveBeenCalled();
  });

  it('should handle specific JWT error messages', () => {
    req.cookies.auth_token = 'bad_token';
    jwt.verify.mockImplementation(() => { throw new jwt.JsonWebTokenError('invalid signature'); });
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'invalid token' });
  });

  it('should return 403 if token has insufficient permissions', () => {
    const validToken = jwt.sign({ userId: 'test_user_id', role: 'user' }, process.env.JWT_SECRET_KEY);
    req.cookies.auth_token = validToken;
    // Mock verify to simulate a user role that does not have the required permissions
    jwt.verify.mockImplementation(() => ({ userId: 'test_user_id', role: 'user' }));
    // Modify verifyToken or add additional middleware to check permissions
    // For this example, we'll assume verifyToken now also checks user roles
    verifyToken(req, res, next);
    // Assuming verifyToken is modified to set status to 403 for insufficient permissions
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'insufficient permissions' });
  });
});
