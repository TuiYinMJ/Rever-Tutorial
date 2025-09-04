-- 创建询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  products_inquired TEXT,
  status TEXT DEFAULT '待处理',
  source TEXT
);

-- 为询盘表添加行级安全策略
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 只允许用户查看自己的询盘
CREATE POLICY "Users can view their own inquiries" 
  ON inquiries FOR SELECT 
  USING (auth.uid() = user_id);

-- 只允许用户插入自己的询盘
CREATE POLICY "Users can insert their own inquiries" 
  ON inquiries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 只允许用户更新自己的询盘
CREATE POLICY "Users can update their own inquiries" 
  ON inquiries FOR UPDATE 
  USING (auth.uid() = user_id);

-- 只允许用户删除自己的询盘
CREATE POLICY "Users can delete their own inquiries" 
  ON inquiries FOR DELETE 
  USING (auth.uid() = user_id);

