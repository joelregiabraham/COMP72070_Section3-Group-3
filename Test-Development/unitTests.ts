import request from 'supertest'; // for making HTTP requests to your Express app
import app from '../app'; // assuming your Express app is exported from this file

describe('Login Route', () => {
  // UT001: True Positive - Successful login
  it('UT001 should return 200 and a user ID when login is successful', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'valid@example.com', password: 'validpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
  });

  // UT002: False Positive - Invalid email format
  it('UT002 should return 400 with error message for invalid email format', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'invalid_email', password: 'validpassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Email is required');
  });

  // UT003: False Positive - Password length less than 6 characters
  it('UT003 should return 400 with error message for password less than 6 characters', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'valid@example.com', password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Password with 6 or more characters required');
  });

  // UT004: False Positive - Incorrect email
  it('UT004 should return 400 with error message for incorrect email', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'nonexistent@example.com', password: 'validpassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid Credentials');
  });

  // UT005: False Positive - Incorrect password
  it('UT005 should return 400 with error message for incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'valid@example.com', password: 'invalidpassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid Credentials');
  });

  
});


