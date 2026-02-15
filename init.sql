-- Inicialización de la base de datos Trader Deportivo
-- Este script se ejecuta automáticamente cuando se crea el contenedor PostgreSQL

-- Crear esquema principal
CREATE SCHEMA IF NOT EXISTS trader;
SET search_path TO trader, public;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'tipster', 'user')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles de tipsters
CREATE TABLE tipster_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    subscription_price DECIMAL(10,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    total_signals INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    roi_percentage DECIMAL(8,2) DEFAULT 0.00,
    followers_count INTEGER DEFAULT 0,
    subscribers_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'pending',
    social_media JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de wallets/billeteras
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    total_deposits DECIMAL(12,2) DEFAULT 0.00,
    total_withdrawals DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de señales/picks
CREATE TABLE signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sport VARCHAR(100) NOT NULL,
    league VARCHAR(200),
    event_name VARCHAR(500) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    pick_type VARCHAR(100) NOT NULL,
    selection VARCHAR(500) NOT NULL,
    odds DECIMAL(8,2) NOT NULL,
    stake DECIMAL(5,2) DEFAULT 1.00,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void', 'half-won', 'half-lost')),
    result DECIMAL(8,2),
    profit_loss DECIMAL(10,2),
    analysis TEXT,
    reasoning TEXT,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tipster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'vip')),
    price DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de seguidores
CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tipster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tipster_id)
);

-- Tabla de transacciones
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'subscription', 'commission', 'refund', 'bonus')),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_id VARCHAR(255),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de auditoría
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_tipster_profiles_user_id ON tipster_profiles(user_id);
CREATE INDEX idx_tipster_profiles_verified ON tipster_profiles(is_verified);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_signals_tipster_id ON signals(tipster_id);
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_tipster_id ON subscriptions(tipster_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_followers_user_id ON followers(user_id);
CREATE INDEX idx_followers_tipster_id ON followers(tipster_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipster_profiles_updated_at BEFORE UPDATE ON tipster_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_signals_updated_at BEFORE UPDATE ON signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador inicial
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) 
VALUES (
    'admin@traderdeportivo.co',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/..G', -- bcrypt hash de 'AdminTD!2024'
    'admin',
    'Administrador',
    'Principal',
    true,
    true
);

-- Insertar usuario demo
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES (
    'usuario@traderdeportivo.co',
    '$2b$12$8K8q0JmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJh', -- bcrypt hash de 'UserTD!2024'
    'user',
    'Usuario',
    'Demo',
    true,
    true
);

-- Insertar tipster demo
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES (
    'tipster@traderdeportivo.co',
    '$2b$12$JmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJhJmQXJh', -- bcrypt hash de 'TipsterTD!2024'
    'tipster',
    'Carlos',
    'Trading',
    true,
    true
);

-- Crear perfiles y wallets para los usuarios demo
INSERT INTO tipster_profiles (user_id, bio, subscription_price, commission_rate, is_verified, verification_status)
SELECT id, 'Tipster profesional con más de 5 años de experiencia en apuestas deportivas', 49.99, 20.00, true, 'verified'
FROM users WHERE email = 'tipster@traderdeportivo.co';

INSERT INTO wallets (user_id, balance, currency)
SELECT id, 1000.00, 'USD' FROM users;

-- Crear índices adicionales para búsquedas
CREATE INDEX idx_signals_sport ON signals(sport);
CREATE INDEX idx_signals_league ON signals(league);
CREATE INDEX idx_signals_event_date ON signals(event_date);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Permisos (ajustar según necesidades)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA trader TO trader_admin;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA trader TO trader_admin;