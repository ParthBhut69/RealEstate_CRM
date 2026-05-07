CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Agent',
<<<<<<< HEAD
    avatar_url VARCHAR(255),
=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
<<<<<<< HEAD
    building_name VARCHAR(255),
    address TEXT,
    location VARCHAR(255),
    area DECIMAL(10, 2),
    size VARCHAR(50),
    type VARCHAR(50),
    amenities TEXT,
    image_url VARCHAR(255),
    images TEXT,
    furnishing_status VARCHAR(50),
=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Planning',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    due_date DATETIME NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    type VARCHAR(50) DEFAULT 'Lead',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'In Progress',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
<<<<<<< HEAD

CREATE TABLE IF NOT EXISTS inquiry_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'reminder',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATETIME,
    is_read INTEGER DEFAULT 0,
    is_resolved INTEGER DEFAULT 0,
    related_id INTEGER,
    related_type VARCHAR(50),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
