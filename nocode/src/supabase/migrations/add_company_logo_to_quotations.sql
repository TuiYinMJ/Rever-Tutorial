-- 为报价单表添加公司Logo字段
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS company_logo TEXT;

