const setAuthCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  });
};

export default setAuthCookie;
