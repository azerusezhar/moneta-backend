import createApp from "./lib/create-app";
import indexRoute from "./routes/index.route";
import authRoute from "./routes/auth/auth.index";
import walletRoute from "./routes/wallet/wallet.index";

const app = createApp();

app.route("/", indexRoute);
app.route("/api", authRoute);
app.route("/api", walletRoute);

export default app;
