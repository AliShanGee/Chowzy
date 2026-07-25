/**
 * Synthetic Benchmark for sequential vs Promise.all concurrent operations.
 * Simulates typical database request latency (e.g., 50ms per query).
 */

const simulatedDbQuery = (name, delayMs) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Result from ${name}`);
        }, delayMs);
    });
};

async function runSequential() {
    const start = Date.now();

    // Simulate first independent query
    const res1 = await simulatedDbQuery('Query 1', 50);
    // Simulate second independent query
    const res2 = await simulatedDbQuery('Query 2', 50);

    const end = Date.now();
    return {
        duration: end - start,
        results: [res1, res2]
    };
}

async function runConcurrent() {
    const start = Date.now();

    // Simulate concurrent queries with Promise.all
    const [res1, res2] = await Promise.all([
        simulatedDbQuery('Query 1', 50),
        simulatedDbQuery('Query 2', 50)
    ]);

    const end = Date.now();
    return {
        duration: end - start,
        results: [res1, res2]
    };
}

async function main() {
    console.log('--- Starting Synthetic Latency Benchmark ---');

    // Warm up
    await runSequential();
    await runConcurrent();

    let totalSeqDuration = 0;
    let totalConDuration = 0;
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
        const seq = await runSequential();
        const con = await runConcurrent();
        totalSeqDuration += seq.duration;
        totalConDuration += con.duration;
    }

    const avgSeq = totalSeqDuration / iterations;
    const avgCon = totalConDuration / iterations;
    const speedup = ((avgSeq - avgCon) / avgSeq) * 100;

    console.log(`Average Sequential Latency: ${avgSeq.toFixed(2)}ms`);
    console.log(`Average Concurrent Latency (Promise.all): ${avgCon.toFixed(2)}ms`);
    console.log(`Latency Reduction: ${speedup.toFixed(2)}%`);
    console.log('--------------------------------------------');
}

main().catch(console.error);
