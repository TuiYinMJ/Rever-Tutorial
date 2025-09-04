-- 检查报价单表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL, -- 不添加外键约束
  customer_id UUID, -- 不添加外键约束
  quotation_number TEXT UNIQUE NOT NULL,
  title TEXT,
  status TEXT DEFAULT '草稿',
  total_amount DECIMAL(12, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  valid_until DATE,
  notes TEXT
);

-- 删除原有的报价单明细表
DROP TABLE IF EXISTS quotation_items;

-- 重新创建报价单明细表，确保引用的表存在
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  quotation_id UUID NOT NULL, -- 移除外键约束
  product_id UUID, -- 移除外键约束
  item_number INTEGER,
  description TEXT,
  quantity DECIMAL(10, 2) DEFAULT 1.00,
  unit_price DECIMAL(12, 2) DEFAULT 0.00,
  total_price DECIMAL(12, 2) DEFAULT 0.00
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

-- 为报价单明细表添加行级安全策略
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

-- 只允许用户查看自己的报价单明细
CREATE POLICY "Users can view their own quotation items" 
  ON quotation_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.user_id = auth.uid()
  ));

-- 只允许用户插入自己的报价单明细
CREATE POLICY "Users can insert their own quotation items" 
  ON quotation_items FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.user_id = auth.uid()
  ));

-- 只允许用户更新自己的报价单明细
CREATE POLICY "Users can update their own quotation items" 
  ON quotation_items FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.user_id = auth.uid()
  ));

-- 只允许用户删除自己的报价单明细
CREATE POLICY "Users can delete their own quotation items" 
  ON quotation_items FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.user_id = auth.uid()
  ));

