import express from "express";

// import controllers
import renderDomainPage from "../controllers/renderDomainPage.mjs";
import renderLoginPage from "../controllers/renderLoginPage.mjs";
import renderUserPage from "../controllers/renderUserPage.mjs";
import renderSignupPage from "../controllers/renderSignupPage.mjs";

const router = express.Router();

router.get("/", renderDomainPage);

router.get("/login", renderLoginPage);

router.get("/user/:id", renderUserPage);

router.get("/signup", renderSignupPage);

export default router;
