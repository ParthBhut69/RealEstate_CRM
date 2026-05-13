CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Agent',
    avatar_url VARCHAR(255),
    reset_token VARCHAR(255),
    reset_expires DATETIME,
    two_factor_enabled INTEGER DEFAULT 0,
    otp_code VARCHAR(10),
    otp_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    building_name VARCHAR(255),
    address TEXT,
    location VARCHAR(255),
    area DECIMAL(10, 2),
    size VARCHAR(50),
    type VARCHAR(50),
    property_for VARCHAR(50),
    configuration VARCHAR(50),
    carpet_area DECIMAL(10, 2),
    price_in_cr DECIMAL(15, 2),
    parking_type VARCHAR(50),
    oc_status VARCHAR(20),
    youtube_link VARCHAR(255),
    instagram_link VARCHAR(255),
    amenities TEXT,
    image_url VARCHAR(255),
    images TEXT,
    furnishing_status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NOT NULL,
    alternate_contact_number VARCHAR(50),
    email_id VARCHAR(255),
    inquiry_type VARCHAR(50), -- Buy, Rent
    property_size VARCHAR(50), -- 1 BHK, 2 BHK, etc.
    budget DECIMAL(15, 2), -- Budget in Cr
    preferred_location VARCHAR(255),
    area TEXT, -- Preferred area/locality
    inquiry_source VARCHAR(100), -- YouTube, Instagram, etc.
    comments TEXT,
    next_followup_date DATETIME,
    followup_status VARCHAR(50) DEFAULT 'New',
    last_followup_date DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    property_type VARCHAR(255), -- e.g., '1 BHK, 2 BHK'
    total_size VARCHAR(100),
    sqft_area DECIMAL(10, 2),
    amenities TEXT, -- comma separated
    price_per_sqft DECIMAL(15, 2),
    total_price DECIMAL(15, 2),
    rera_number VARCHAR(100),
    builder_name VARCHAR(255),
    builder_website VARCHAR(255),
    possession_date DATE,
    status VARCHAR(50) DEFAULT 'Under Construction', -- 'Ready to Move', 'Under Construction', 'Sold Out'
    map_location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
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
