const express = require("express");
const { Oauth2Client } = require("google-auth-library");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "" }));

const client = new Oauth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/auth/google", (req, res) => {
  const { token } = req.body;
  try {
    const ticket = client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;

    return res.status(200).json({
      success: true,
      user: {
        Id: userId,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (error) {
      return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
