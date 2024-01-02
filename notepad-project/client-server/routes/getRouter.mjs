import express from "express";

// import controllers
import renderDomainPage from "../controllers/renderDomainPage.mjs";
import renderLoginPage from "../controllers/renderLoginPage.mjs";
import renderSignupPage from "../controllers/renderSignupPage.mjs";
import sendBeforeLogoutData from "../controllers/sendBeforeLogoutData.mjs";

const router = express.Router();

router.get("/", renderDomainPage);

router.get("/login", renderLoginPage);

router.get("/user/:id", renderDomainPage);

router.get("/tabs/:id", sendBeforeLogoutData);

router.get("/signup", renderSignupPage);

export default router;
