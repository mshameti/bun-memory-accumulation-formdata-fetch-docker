async function runTest() {
  let i = 0;
  while (i < 1000) {
    let formData = new FormData();
    let fiveMBFile = new Blob(["a".repeat(5242880)]);
    formData.append("files", fiveMBFile);

    // Issue: Memory accumulation in Bun until container OOM
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

    console.log(
      process.env.RUNTIME === "bun" ? "\t\t\tBun:" : "Node:",
      Math.trunc(process.memoryUsage().rss / 1024 / 1024),
      "MB"
    );

    i++;
  }
}

runTest().catch(console.error);
