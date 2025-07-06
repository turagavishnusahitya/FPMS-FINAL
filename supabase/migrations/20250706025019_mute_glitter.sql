-- Faculty Performance Portal Database Schema

-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE faculty_performance;

-- Connect to the database and run the following:

-- Faculty users table
CREATE TABLE IF NOT EXISTS faculty_users (
    login_id VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    security_code VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    security_code VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty submissions table
CREATE TABLE IF NOT EXISTS faculty_submissions (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculty_users(login_id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    
    -- Teaching & Learning (L1) - 6 fields
    l1_1 TEXT,
    l1_2 TEXT,
    l1_3 TEXT,
    l1_4 TEXT,
    l1_5 TEXT,
    l1_6 TEXT,
    
    -- Research & Consultancy (L2) - 9 fields
    l2_1 TEXT,
    l2_2 TEXT,
    l2_3 TEXT,
    l2_4 TEXT,
    l2_5 TEXT,
    l2_6 TEXT,
    l2_7 TEXT,
    l2_8 TEXT,
    l2_9 TEXT,
    
    -- Professional Development (L3) - 9 fields
    l3_1 TEXT,
    l3_2 TEXT,
    l3_3 TEXT,
    l3_4 TEXT,
    l3_5 TEXT,
    l3_6 TEXT,
    l3_7 TEXT,
    l3_8 TEXT,
    l3_9 TEXT,
    
    -- Contribution to Institute (L4) - 6 fields
    l4_1 TEXT,
    l4_2 TEXT,
    l4_3 TEXT,
    l4_4 TEXT,
    l4_5 TEXT,
    l4_6 TEXT,
    
    -- Student Development (L5) - 5 fields
    l5_1 TEXT,
    l5_2 TEXT,
    l5_3 TEXT,
    l5_4 TEXT,
    l5_5 TEXT,
    
    is_draft BOOLEAN DEFAULT true,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(faculty_id, year)
);

-- Admin scores table
CREATE TABLE IF NOT EXISTS admin_scores (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculty_users(login_id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    scored_by VARCHAR(50) REFERENCES admin_users(admin_id),
    
    -- A1: Teaching & Learning scores (6 criteria)
    a1_1 INTEGER,
    a1_2 INTEGER,
    a1_3 INTEGER,
    a1_4 INTEGER,
    a1_5 INTEGER,
    a1_6 INTEGER,
    
    -- A2: Research & Consultancy scores (9 criteria)
    a2_1 INTEGER,
    a2_2 INTEGER,
    a2_3 INTEGER,
    a2_4 INTEGER,
    a2_5 INTEGER,
    a2_6 INTEGER,
    a2_7 INTEGER,
    a2_8 INTEGER,
    a2_9 INTEGER,
    
    -- A3: Professional Development scores (9 criteria)
    a3_1 INTEGER,
    a3_2 INTEGER,
    a3_3 INTEGER,
    a3_4 INTEGER,
    a3_5 INTEGER,
    a3_6 INTEGER,
    a3_7 INTEGER,
    a3_8 INTEGER,
    a3_9 INTEGER,
    
    -- A4: Contribution to Institute scores (6 criteria)
    a4_1 INTEGER,
    a4_2 INTEGER,
    a4_3 INTEGER,
    a4_4 INTEGER,
    a4_5 INTEGER,
    a4_6 INTEGER,
    
    -- A5: Student Development scores (5 criteria)
    a5_1 INTEGER,
    a5_2 INTEGER,
    a5_3 INTEGER,
    a5_4 INTEGER,
    a5_5 INTEGER,
    
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(faculty_id, year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_submissions_faculty_year ON faculty_submissions(faculty_id, year);
CREATE INDEX IF NOT EXISTS idx_admin_scores_faculty_year ON admin_scores(faculty_id, year);
CREATE INDEX IF NOT EXISTS idx_faculty_submissions_year ON faculty_submissions(year);
CREATE INDEX IF NOT EXISTS idx_faculty_submissions_draft ON faculty_submissions(is_draft);