import createApp from "./lib/create-app";
import indexRoute from "./routes/index.route";
import authRoute from "./routes/auth/auth.index";

const app = createApp();

app.route("/", indexRoute);
app.route("/api", authRoute);

export default app;
