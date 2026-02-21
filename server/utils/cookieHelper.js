export const setAuthCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  });
};

export const setPasswordResetCookie = (res, token) => {
  res.cookie("reset_token", token, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    sameSite: "lax",
    secure: false, // Set to true in production
  });
};
