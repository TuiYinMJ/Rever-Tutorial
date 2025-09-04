-- 为报价单表添加报价单号前缀字段
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS quotation_number_prefix TEXT DEFAULT 'QUO-';

