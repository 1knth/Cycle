import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
// import accountRoutes from './routes/account.routes.js';
import plaidRoutes from './routes/plaid.routes.js';
import userRoutes from './routes/user.routes.js';

//server
const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  // plaid webhooks:
  // 52.21.26.131
  // 52.21.47.157
  // 52.41.247.19
  // 52.88.82.239
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/api', (req, res) => {
  res.send('Cycle API running');
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n`);
  });

  // -- TO BE IMPLEMENTED -- //
  // wsServer acts as a secondary listener when passing app.listen into the callback
  const wsServer = new WebSocketServer({ server });

  // 3. Create the global registry for Plaid webhooks to access
  const wsClients = new Map();
  app.set('wsClients', wsClients);
  // 4. Handle incoming socket connections
  wsServer.on('connection', (ws) => {
    console.log("WS Client Connected.");
    
    // Placeholder: We will map the user ID to this socket connection later
    
    ws.on('close', () => {
      console.log("WS Client Disconnected.");
    });
  });

}).catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}\n`);
//   });
// });

