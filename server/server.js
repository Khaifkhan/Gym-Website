const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const { google } = require("googleapis");
const cookieParser = require("cookie-parser");
require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.body_temperature.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.location.read",
  "https://www.googleapis.com/auth/fitness.nutrition.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
];

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scopes: SCOPES,
});

const fitness = google.fitness("v1");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log("login token:", token);

  if (!token) {
    return res.status(400).json({ success: false, error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Decoded payload:", payload);

    req.user = {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({
      success: false,
      error: `Google Auth Error: ${error.message}`,
    });
  }
};

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  console.log("Received token:", token);

  if (!token) {
    return res.status(400).json({ success: false, error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Decoded payload:", payload);

    const userId = payload.sub;

    res.status(200).json({
      success: true,
      user: {
        Id: userId,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({
      success: false,
      error: `Google Auth Error: ${error.message}`,
    });
  }
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const profile = await client.getTokenInfo(tokens.access_token);
    const jwtPayload = {
      displayName: profile.displayName,
      profilePhotoUrl: profile.profilePhotoUrl,
      userID: profile.userID,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
});
const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "No authorization header. Please log in first." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userProfile = decoded;
    next();
  } catch (error) {
    console.error("Invalid JWT:", error);
    return res
      .status(401)
      .send({ error: "Invalid access token. Please log in again." });
  }
};

app.get("/auth/user", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

app.get("/fetch-google-fit-data", verifyToken, async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const { userId } = req.user;

  try {
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });
    auth.setCredentials({ access_token: token });

    const startTime = Date.now() - 10 * 24 * 60 * 60 * 1000;
    const endTime = Date.now();

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.blood_glucose" },
          { dataTypeName: "com.google.blood_pressure" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.weight" },
          { dataTypeName: "com.google.height" },
          { dataTypeName: "com.google.sleep.segment" },
          { dataTypeName: "com.google.body.fat.percentage" },
          { dataTypeName: "com.google.menstruation" },
        ],
        bucketByTime: { duration: 86400000 },
        startTime: startTime,
        endTime: endTime,
      },
      auth: auth,
    });

    const fitnessData = response.data.bucket.map((data) => {
      const date = new Date(parseInt(data.startTime));
      const endDate = date.toDateString();

      let stepCount = 0;
      let heartRate = 0;
      let weight = 0;
      let sleep = 0;
      let bloodGlucose = 0;
      let bloodPressure = 0;
      let bodyFatPercentage = 0;

      data.dataset.forEach((ds) => {
        if (ds.point) {
          ds.point.forEach((point) => {
            if (ds.dataSourceId.includes("step_count")) {
              stepCount = point.value[0]?.intVal || 0;
            }
            if (ds.dataSourceId.includes("heart_rate")) {
              heartRate = point.value[0]?.fpVal || 0;
            }
            if (ds.dataSourceId.includes("weight")) {
              weight = point.value[0]?.fpVal || 0;
            }
            if (ds.dataSourceId.includes("sleep")) {
              sleep = point.value[0]?.intVal || 0; 
            }
            if (ds.dataSourceId.includes("blood_glucose")) {
              bloodGlucose = point.value[0]?.fpVal || 0;
            }
            if (ds.dataSourceId.includes("blood_pressure")) {
              bloodPressure = point.value[0]?.fpVal || 0;
            }
            if (ds.dataSourceId.includes("body_fat")) {
              bodyFatPercentage = point.value[0]?.fpVal || 0;
            }
          });
        }
      });

      return {
        date,
        step_count: stepCount,
        heart_rate: heartRate,
        weight,
        sleep,
        blood_glucose: bloodGlucose,
        blood_pressure: bloodPressure,
        body_fat_percentage: bodyFatPercentage,
      };
    });

    res.status(200).json({
      success: true,
      user: req.user,
      fitnessData,
    });
  } catch (error) {
    console.error("Error fetching Google Fit data:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching Google Fit data",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
