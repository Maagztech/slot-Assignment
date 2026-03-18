import express from "express";
import auth from "../middleware/auth";
import gameCtrl from "../utils/gameUtils";
const router = express.Router();

router.post("/login_or_signup", gameCtrl.SignupOrLogin);
router.post("/spin", auth, gameCtrl.Bet_spin);
router.post("/simulate", auth, gameCtrl.Simulate);
router.post("/add_to_wallet", auth, gameCtrl.Add_to_wallet);
router.get("/wallet", auth, gameCtrl.Get_wallet);
export default router;
