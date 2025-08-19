const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Form App API',
        endpoints: {
            forms: '/api/forms',
            users: '/api/users',
            admin: '/api/admin',
            references: '/api/references'
        }
    });
});


app.use('/api/forms', require('./routes/formRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dictionaries', require('./routes/dictionaryRoutes'));

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        availableRoutes: ['/api/forms', '/api/users', '/api/admin', '/api/references', '/health']
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;