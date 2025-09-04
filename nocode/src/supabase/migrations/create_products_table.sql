-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit TEXT DEFAULT '件',
  price DECIMAL(12, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  image_url TEXT
);

-- 为产品表添加行级安全策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 只允许用户查看自己的产品
CREATE POLICY "Users can view their own products" 
  ON products FOR SELECT 
  USING (auth.uid() = user_id);

-- 只允许用户插入自己的产品
CREATE POLICY "Users can insert their own products" 
  ON products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 只允许用户更新自己的产品
CREATE POLICY "Users can update their own products" 
  ON products FOR UPDATE 
  USING (auth.uid() = user_id);

-- 只允许用户删除自己的产品
CREATE POLICY "Users can delete their own products" 
  ON products FOR DELETE 
  USING (auth.uid() = user_id);

