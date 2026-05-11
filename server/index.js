const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (like uploaded profile pictures)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/loanInquiries', require('./routes/loanInquiries'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.send('BrokerFlow API - Premium Real Estate Management');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Start background job that auto-creates alerts for due/overdue tasks
  const { startAlertChecker } = require('./jobs/alertChecker');
  startAlertChecker();
});
