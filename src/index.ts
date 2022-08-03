import app from "./app";


async function main() {
  try {
    app.listen(3000);
    console.log("liste on port 3000");
  } catch (error) {
    console.error(error);
  }
}

main();
