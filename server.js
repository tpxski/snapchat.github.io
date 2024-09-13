const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Sync the database
sequelize.sync().then(() => console.log('Database synced'));

// Serve static files (like your HTML file)
app.use(express.static('public'));

// Handle form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: username } });
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle registration for demo purposes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email: username, hashedPassword });
        res.send('User registered successfully');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});