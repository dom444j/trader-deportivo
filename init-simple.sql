-- Crear extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'tipster', 'user')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles de tipsters
CREATE TABLE IF NOT EXISTS tipster_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialization VARCHAR(255),
    win_rate DECIMAL(5,2) DEFAULT 0,
    total_picks INTEGER DEFAULT 0,
    successful_picks INTEGER DEFAULT 0,
    subscription_price DECIMAL(10,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de billeteras
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de señales
CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sport VARCHAR(50) NOT NULL,
    league VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    prediction TEXT NOT NULL,
    odds DECIMAL(8,2) NOT NULL,
    stake DECIMAL(5,2) NOT NULL,
    result VARCHAR(20) DEFAULT 'pending',
    profit_loss DECIMAL(10,2) DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tipster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    price_paid DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios demo
INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES
('admin@traderdeportivo.co', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrador', 'Principal', '+573001234567'),
('usuario@traderdeportivo.co', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Juan', 'Pérez', '+573001234568'),
('tipster@traderdeportivo.co', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tipster', 'Carlos', 'Rodríguez', '+573001234569');

-- Insertar perfil de tipster
INSERT INTO tipster_profiles (user_id, bio, specialization, subscription_price, is_verified, verification_status) VALUES
((SELECT id FROM users WHERE email = 'tipster@traderdeportivo.co'), 'Experto en fútbol y tenis con más de 10 años de experiencia', 'Fútbol, Tenis', 29.99, true, 'approved');

-- Insertar billeteras
INSERT INTO wallets (user_id, balance, currency) VALUES
((SELECT id FROM users WHERE email = 'admin@traderdeportivo.co'), 10000, 'USD'),
((SELECT id FROM users WHERE email = 'usuario@traderdeportivo.co'), 1000, 'USD'),
((SELECT id FROM users WHERE email = 'tipster@traderdeportivo.co'), 5000, 'USD');

-- Insertar señales de ejemplo
INSERT INTO signals (tipster_id, sport, league, event_name, event_date, prediction, odds, stake, result) VALUES
((SELECT id FROM users WHERE email = 'tipster@traderdeportivo.co'), 'Fútbol', 'La Liga', 'Real Madrid vs Barcelona', CURRENT_TIMESTAMP + INTERVAL '2 days', 'Real Madrid gana', 2.10, 5.00, 'pending'),
((SELECT id FROM users WHERE email = 'tipster@traderdeportivo.co'), 'Tenis', 'ATP Tour', 'Nadal vs Djokovic', CURRENT_TIMESTAMP + INTERVAL '1 day', 'Nadal gana primer set', 1.85, 3.00, 'pending');

-- Insertar suscripción de ejemplo
INSERT INTO subscriptions (user_id, tipster_id, status, price_paid) VALUES
((SELECT id FROM users WHERE email = 'usuario@traderdeportivo.co'), (SELECT id FROM users WHERE email = 'tipster@traderdeportivo.co'), 'active', 29.99);