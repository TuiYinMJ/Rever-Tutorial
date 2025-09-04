-- 为报价单表添加公司信息字段
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS company_phone TEXT,
ADD COLUMN IF NOT EXISTS company_email TEXT,
ADD COLUMN IF NOT EXISTS payment_terms TEXT,
ADD COLUMN IF NOT EXISTS delivery_terms TEXT,
ADD COLUMN IF NOT EXISTS shipping_method TEXT,
ADD COLUMN IF NOT EXISTS customer_contact TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_address TEXT;

