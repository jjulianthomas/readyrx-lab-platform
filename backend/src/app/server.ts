import { createApp } from "./createApp";

const port = Number(process.env.PORT ?? "4000");
const app = createApp();

app.listen(port, () => {
  console.info(`Healthcare lab platform API listening on port ${port}`);
});
