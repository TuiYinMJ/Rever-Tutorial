-- 步骤1: 删除可能存在的旧约束，防止冲突
ALTER TABLE public.quotations
DROP CONSTRAINT IF EXISTS quotations_customer_id_fkey;

-- 步骤2: 创建新的、正确的外键约束
ALTER TABLE public.quotations
ADD CONSTRAINT quotations_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES public.customers (id) ON DELETE SET NULL;

