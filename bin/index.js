const app = require('../app');
const http = require('http');
const connectToDB = require('../config/db');

const PORT = process.env.PORT || 5000;
const MAX_RETRIES = 5;
let retries = 0;

function startServer(port) {
    const server = http.createServer(app);

    server.listen(port, async () => {
        try {
            await connectToDB();
            console.log(`Server running on http://localhost:${port}`);
            console.log('Ctrl + C to stop');
        } catch (error) {
            console.error("Error starting server:", error);
            process.exit(1);
        }
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (retries < MAX_RETRIES) {
                retries++;
                console.log(`Port ${port} is already in use. Retrying... (${retries}/${MAX_RETRIES})`);
                startServer(port + 1); // Try next port
            } else {
                console.error(`Maximum retries (${MAX_RETRIES}) exceeded. Exiting...`);
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

startServer(PORT);
