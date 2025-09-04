-- 创建报价单主表
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  quotation_number TEXT UNIQUE NOT NULL,
  title TEXT,
  status TEXT DEFAULT '草稿',
  total_amount DECIMAL(12, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  valid_until DATE,
  notes TEXT
);

-- 为报价单表添加行级安全策略
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 只允许用户查看自己的报价单
CREATE POLICY "Users can view their own quotations" 
  ON quotations FOR SELECT 
  USING (auth.uid() = user_id);

-- 只允许用户插入自己的报价单
CREATE POLICY "Users can insert their own quotations" 
  ON quotations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 只允许用户更新自己的报价单
CREATE POLICY "Users can update their own quotations" 
  ON quotations FOR UPDATE 
  USING (auth.uid() = user_id);

-- 只允许用户删除自己的报价单
CREATE POLICY "Users can delete their own quotations" 
  ON quotations FOR DELETE 
  USING (auth.uid() = user_id);
