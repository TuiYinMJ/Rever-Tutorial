-- 创建报价单明细表
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id),
  item_number INTEGER,
  description TEXT,
  quantity DECIMAL(10, 2) DEFAULT 1.00,
  unit_price DECIMAL(12, 2) DEFAULT 0.00,
  total_price DECIMAL(12, 2) DEFAULT 0.00
);

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
