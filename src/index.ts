import app from "./app";
import {PORT} from './config'


async function main() {
  try {
    app.listen(PORT);
    console.log("liste on port 3000",PORT);
  } catch (error) {
    console.error(error);
  }
}

main();
