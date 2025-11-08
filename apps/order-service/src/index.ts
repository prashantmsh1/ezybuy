import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
    return reply.status(200).send({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

const start = async () => {
    try {
        await fastify.listen({ port: 8001 });
        console.log("Order Service is running at http://0.0.0.0:8001");
    } catch (err) {
        fastify.log.error(err);

        process.exit(1);
    }
};

start();
