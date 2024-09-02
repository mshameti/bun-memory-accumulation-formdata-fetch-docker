async function runLeak1() {
  let i = 0;
  while (i < 10000) {
    let formData = new FormData();
    let fiveMBFile = new Blob(["a".repeat(5242880)]);
    formData.append("files", fiveMBFile);

    // Memory Leak 1: FormData as Request Body
    const res = await fetch("http://receiver:3000", {
      method: "POST",
      body: formData,
    });

    // NO memory accumulation if you send file as JSON.
    // const resJson = await fetch("http://receiver:3000", {
    //   method: "POST",
    //   body: JSON.stringify({ content: fiveMBFile }),
    // });

    // NO impact on GC.
    // formData = undefined;
    // fiveMBFile = undefined;

    // NO impact on GC.
    // if (process.env.RUNTIME === "bun") {
    //   setTimeout(() => {
    //     global.gc?.();
    //     Bun.gc(true);
    //     // if (process.versions.bun) console.log(require("bun:jsc").heapStats());
    //   }, 100);
    // }

    // Trigger read of stream
    const buffer = await res.arrayBuffer();

    if (buffer) {
      console.log(
        process.env.RUNTIME === "bun" ? "\t\t\tBun:" : "Node:",
        Math.trunc(process.memoryUsage().rss / 1024 / 1024),
        "MB"
      );
    }

    i++;
  }
}

async function runLeak2() {
  let i = 0;
  while (i < 10000) {
    const res = await fetch("http://receiver:3000/image", { method: "GET" });

    // Workaround fix #1: Comment out the usage of 'body'.
    if (!res.body) {
      throw new Error("Invalid response");
    }

    // Memory leak #2: Reading response after accessing body.
    const buffer = await res.arrayBuffer();

    // Workaround fix #2: Use Bun-optimized API.
    // const buffer = await Bun.readableStreamToArrayBuffer(res.body);

    if (buffer) {
      console.log(
        process.env.RUNTIME === "bun" ? "\t\t\tBun:" : "Node:",
        Math.trunc(process.memoryUsage().rss / 1024 / 1024),
        "MB"
      );
    }
  }
}

if (process.env.LEAK === "2") {
  console.log("Running Mem Leak 2 Test");
  runLeak2().catch(console.error);
} else {
  console.log("Running Mem Leak 1 Test");
  runLeak1().catch(console.error);
}
