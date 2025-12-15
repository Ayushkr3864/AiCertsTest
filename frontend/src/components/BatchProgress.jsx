export default function BatchProgress({ certificates }) {
  const batches = certificates.reduce((acc, cert) => {
    acc[cert.batchId] = acc[cert.batchId] || {
      total: 0,
      completed: 0,
    };

    acc[cert.batchId].total++;
    if (cert.status === "ISSUED") acc[cert.batchId].completed++;

    return acc;
  }, {});

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-3 text-white">Batch Progress</h2>

      {Object.entries(batches).map(([batchId, data]) => (
        <div key={batchId} className="mb-3">
          <p className="text-sm mb-1 text-white">
            Batch {batchId}: {data.completed}/{data.total} complete
          </p>

          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded"
              style={{
                width: `${(data.completed / data.total) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
