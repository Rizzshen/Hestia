import * as service from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await service.login(req.body);
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
      })
      .json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};


export const getMe = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  res.status(200).json(req.user);
};