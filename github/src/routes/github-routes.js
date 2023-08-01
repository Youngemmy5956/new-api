import express from "express";
import { getAccessToken, getUserData } from "../controllers/github-controller";

const router = express.Router();

router.get("/accessToken", (req, res) => {
  const code = req.query.code;
  getAccessToken(code).then((resp) => res.json(resp));
});

router.get("/userData", (req, res) => {
  const accessToken = req.query.accessToken;
  getUserData(accessToken).then((resp) => res.json(resp));
});

export default router;