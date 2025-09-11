-- 初始化数据库脚本
-- 创建数据库和基础配置

-- 创建数据库（如果不存在）
-- SELECT 'CREATE DATABASE nextjs_tutorial'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nextjs_tutorial')\gexec

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 创建系统配置表的基础数据
INSERT INTO system_configs (id, key, value, description, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'app_version', '1.0.0', '应用版本号', NOW(), NOW()),
    (uuid_generate_v4(), 'maintenance_mode', 'false', '维护模式开关', NOW(), NOW()),
    (uuid_generate_v4(), 'max_upload_size', '10485760', '最大上传文件大小(字节)', NOW(), NOW()),
    (uuid_generate_v4(), 'session_timeout', '86400', '会话超时时间(秒)', NOW(), NOW()),
    (uuid_generate_v4(), 'rate_limit_max', '100', '速率限制最大请求数', NOW(), NOW()),
    (uuid_generate_v4(), 'rate_limit_window', '900', '速率限制时间窗口(秒)', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- 创建索引优化查询性能
-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 文章表索引
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_title_content ON posts USING GIN(to_tsvector('chinese', title || ' ' || content));

-- 评论表索引
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 文件上传表索引
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_mime_type ON file_uploads(mime_type);

-- 系统配置表索引
CREATE INDEX IF NOT EXISTS idx_system_configs_key ON system_configs(key);

-- 验证码表索引
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_type ON verification_codes(type);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_used ON verification_codes(used);

-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(
    id TEXT,
    title TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP,
    author_username TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.content,
        p.category,
        p.tags,
        p.created_at,
        u.username as author_username,
        ts_rank(to_tsvector('chinese', p.title || ' ' || p.content), plainto_tsquery('chinese', search_query)) as rank
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE
        p.published = true
        AND to_tsvector('chinese', p.title || ' ' || p.content) @@ plainto_tsquery('chinese', search_query)
    ORDER BY rank DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 创建清理过期验证码的函数
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM verification_codes
    WHERE expires_at < NOW() OR (used = true AND created_at < NOW() - INTERVAL '1 day');

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建定时任务清理过期数据（需要 pg_cron 扩展）
-- SELECT cron.schedule('cleanup-verification-codes', '0 2 * * *', 'SELECT cleanup_expired_verification_codes();');

-- 创建触发器：更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表创建 updated_at 触发器
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_configs_updated_at
    BEFORE UPDATE ON system_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建示例数据（仅在开发环境）
-- INSERT INTO users (id, email, username, password, created_at, updated_at)
-- VALUES (
--     uuid_generate_v4(),
--     'admin@example.com',
--     'admin',
--     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqP4JH1xCQWMT9K', -- password: admin123
--     NOW(),
--     NOW()
-- ) ON CONFLICT (email) DO NOTHING;
