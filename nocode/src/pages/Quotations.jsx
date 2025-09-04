import { jsPDF } from 'jspdf';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { DialogContent, DialogTitle, Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { SelectItem, Select, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Eye, Trash2, Filter, Search, Upload, Edit, MoreHorizontal, Languages, FileText, Plus, Download } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenu, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
const Quotations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // 表单状态
  const [formData, setFormData] = useState({
    customer_id: '',
    quotation_number: '',
    title: '',
    status: '草稿',
    currency: 'USD',
    valid_until: '',
    notes: '',
    company_logo: '',
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    payment_terms: '',
    delivery_terms: '',
    shipping_method: '',
    customer_contact: '',
    customer_phone: '',
    customer_email: '',
    customer_address: ''
  });

  // 报价单项目
  const [quotationItems, setQuotationItems] = useState([
    { id: Date.now(), product_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }
  ]);

  // 自定义列
  const [customColumns, setCustomColumns] = useState([
    { id: 'model', name: '型号', visible: true }
  ]);

  // 翻译状态
  const [translation, setTranslation] = useState({
    language: 'zh',
    data: null
  });

  // 获取报价单数据
  const { data: quotations, isLoading, refetch } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select('*, customers(company_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // 获取客户数据
  const { data: customers } = useQuery({
    queryKey: ['customers-for-quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name')
        .order('company_name');
      
      if (error) throw error;
      return data;
    }
  });

  // 获取产品数据
  const { data: products } = useQuery({
    queryKey: ['products-for-quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, currency, image_url')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理状态选择变化
  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  // 处理货币选择变化
  const handleCurrencyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      currency: value
    }));
  };

  // 处理客户选择变化
  const handleCustomerChange = (value) => {
    setFormData(prev => ({
      ...prev,
      customer_id: value
    }));
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      customer_id: '',
      quotation_number: '',
      title: '',
      status: '草稿',
      currency: 'USD',
      valid_until: '',
      notes: '',
      company_logo: '',
      company_name: '',
      company_address: '',
      company_phone: '',
      company_email: '',
      payment_terms: '',
      delivery_terms: '',
      shipping_method: '',
      customer_contact: '',
      customer_phone: '',
      customer_email: '',
      customer_address: ''
    });
    setQuotationItems([
      { id: Date.now(), product_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }
    ]);
    setEditingQuotation(null);
  };

  // 打开编辑对话框
  const openEditDialog = async (quotation) => {
    setEditingQuotation(quotation);
    setFormData({
      customer_id: quotation.customer_id || '',
      quotation_number: quotation.quotation_number || '',
      title: quotation.title || '',
      status: quotation.status || '草稿',
      currency: quotation.currency || 'USD',
      valid_until: quotation.valid_until || '',
      notes: quotation.notes || '',
      company_logo: quotation.company_logo || '',
      company_name: quotation.company_name || '',
      company_address: quotation.company_address || '',
      company_phone: quotation.company_phone || '',
      company_email: quotation.company_email || '',
      payment_terms: quotation.payment_terms || '',
      delivery_terms: quotation.delivery_terms || '',
      shipping_method: quotation.shipping_method || '',
      customer_contact: quotation.customer_contact || '',
      customer_phone: quotation.customer_phone || '',
      customer_email: quotation.customer_email || '',
      customer_address: quotation.customer_address || ''
    });

    // 获取报价单项目
    const { data: items, error } = await supabase
      .from('quotation_items')
      .select('*')
      .eq('quotation_id', quotation.id)
      .order('item_number');

    if (error) {
      toast.error('获取报价单项目失败: ' + error.message);
      return;
    }

    if (items && items.length > 0) {
      setQuotationItems(items.map(item => ({
        ...item,
        id: item.id
      })));
    } else {
      setQuotationItems([
        { id: Date.now(), product_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }
      ]);
    }

    setIsDialogOpen(true);
  };

  // 打开查看对话框
  const openViewDialog = async (quotation) => {
    setViewingQuotation(quotation);
    
    // 获取报价单项目
    const { data: items, error } = await supabase
      .from('quotation_items')
      .select('*')
      .eq('quotation_id', quotation.id)
      .order('item_number');

    if (error) {
      toast.error('获取报价单项目失败: ' + error.message);
      return;
    }

    if (items) {
      setViewingQuotation(prev => ({
        ...prev,
        items: items
      }));
    }

    setIsViewDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // 关闭查看对话框
  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingQuotation(null);
    setTranslation({ language: 'zh', data: null });
  };

  // 添加报价单项
  const addQuotationItem = () => {
    setQuotationItems(prev => [
      ...prev,
      { id: Date.now(), product_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }
    ]);
  };

  // 删除报价单项
  const removeQuotationItem = (id) => {
    if (quotationItems.length <= 1) {
      toast.error('至少需要保留一个项目');
      return;
    }
    setQuotationItems(prev => prev.filter(item => item.id !== id));
  };

  // 更新报价单项
  const updateQuotationItem = (id, field, value) => {
    setQuotationItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // 如果是选择产品，自动填充描述和单价
          if (field === 'product_id') {
            const product = products?.find(p => p.id === value);
            if (product) {
              updatedItem.description = product.name;
              updatedItem.unit_price = product.price || 0;
              updatedItem.total_price = (updatedItem.quantity || 0) * (product.price || 0);
            }
          }
          
          // 如果是数量或单价变化，重新计算总价
          if (field === 'quantity' || field === 'unit_price') {
            updatedItem.total_price = (updatedItem.quantity || 0) * (updatedItem.unit_price || 0);
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // 计算总金额
  const calculateTotalAmount = () => {
    return quotationItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  // 生成报价单号
  const generateQuotationNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    
    // 获取当天创建的报价单数量
    const todayQuotations = quotations?.filter(q => 
      q.created_at && q.created_at.startsWith(today.toISOString().split('T')[0])
    ) || [];
    
    const sequence = todayQuotations.length + 1;
    return `QUO-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  };

  // 自动生成报价单号
  const handleAutoGenerateNumber = () => {
    const autoNumber = generateQuotationNumber();
    setFormData(prev => ({
      ...prev,
      quotation_number: autoNumber
    }));
  };

  // 提交表单（新增或更新报价单）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 基本验证
      if (!formData.customer_id) {
        toast.error('请选择客户');
        return;
      }
      
      // 如果是新增且没有报价单号，则自动生成
      let quotationNumber = formData.quotation_number;
      if (!editingQuotation && !quotationNumber) {
        quotationNumber = generateQuotationNumber();
      }
      
      if (quotationItems.some(item => !item.description)) {
        toast.error('请填写所有项目的产品描述');
        return;
      }
      
      const totalAmount = calculateTotalAmount();
      
      if (editingQuotation) {
        // 更新报价单
        const { error: updateError } = await supabase
          .from('quotations')
          .update({
            ...formData,
            quotation_number: quotationNumber,
            total_amount: totalAmount,
            updated_at: new Date()
          })
          .eq('id', editingQuotation.id);
        
        if (updateError) throw updateError;
        
        // 删除原有的报价单项
        const { error: deleteError } = await supabase
          .from('quotation_items')
          .delete()
          .eq('quotation_id', editingQuotation.id);
        
        if (deleteError) throw deleteError;
        
        // 插入新的报价单项
        const itemsToInsert = quotationItems.map((item, index) => ({
          quotation_id: editingQuotation.id,
          product_id: item.product_id || null,
          item_number: index + 1,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }));
        
        const { error: insertError } = await supabase
          .from('quotation_items')
          .insert(itemsToInsert);
        
        if (insertError) throw insertError;
        
        toast.success('报价单更新成功');
      } else {
        // 新增报价单
        const { data: quotationData, error: insertError } = await supabase
          .from('quotations')
          .insert([{
            ...formData,
            quotation_number: quotationNumber,
            total_amount: totalAmount,
            user_id: (await supabase.auth.getUser()).data.user.id
          }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        // 插入报价单项
        const itemsToInsert = quotationItems.map((item, index) => ({
          quotation_id: quotationData.id,
          product_id: item.product_id || null,
          item_number: index + 1,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }));
        
        const { error: itemsError } = await supabase
          .from('quotation_items')
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
        
        toast.success('报价单创建成功');
      }
      
      // 刷新数据
      queryClient.invalidateQueries(['quotations']);
      closeDialog();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 删除报价单
  const handleDeleteQuotation = async (id) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('报价单删除成功');
      queryClient.invalidateQueries(['quotations']);
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    }
  };

  // 翻译报价单内容
  const translateQuotation = async (quotation, targetLang) => {
    try {
      // 这里模拟翻译过程，实际应用中可以调用翻译API
      const translatedData = {
        ...quotation,
        company_name: targetLang === 'en' ? 'Foreign Trade Business Assistant' : quotation.company_name,
        company_address: targetLang === 'en' ? 'Technology Park, Nanshan District, Shenzhen, China' : quotation.company_address,
        payment_terms: targetLang === 'en' ? 'T/T 30% in advance, 70% balance' : quotation.payment_terms,
        delivery_terms: targetLang === 'en' ? '25-30 days after receiving advance payment' : quotation.delivery_terms,
        shipping_method: targetLang === 'en' ? 'Sea Shipping' : quotation.shipping_method,
        items: quotation.items?.map(item => ({
          ...item,
          description: targetLang === 'en' ? `Product: ${item.description}` : item.description
        })) || []
      };
      
      setTranslation({
        language: targetLang,
        data: translatedData
      });
      
      toast.success(`报价单已翻译为${targetLang === 'en' ? '英文' : '中文'}`);
    } catch (error) {
      toast.error('翻译失败: ' + error.message);
    }
  };

  // 导出PDF
  const handleExportPDF = async (quotation, isTranslated = false) => {
    try {
      const dataToExport = isTranslated && translation.data ? translation.data : quotation;
      
      // 获取报价单项目
      let items = dataToExport.items;
      if (!items) {
        const { data, error } = await supabase
          .from('quotation_items')
          .select('*')
          .eq('quotation_id', quotation.id)
          .order('item_number');

        if (error) throw error;
        items = data;
      }

      // 创建PDF
      const doc = new jsPDF();
      
      // 添加思源黑体字体支持
      // 使用思源黑体的 Base64 编码（这里使用一个简化的示例，实际应用中应使用完整字体）
      const fontBase64 = "AAEAAAAQAQAABAAARkZUTW6mHGAAAwAIAAAAIgAAAC5HREVGABQAAP/8hAAEAAAAAEhQT0MABQAA//wFAABHTFNZAA0AAAD8AAABQAAAAGoAAAAA";
      doc.addFileToVFS("NotoSansSC-normal.ttf", fontBase64);
      doc.addFont("NotoSansSC-normal.ttf", "NotoSansSC", "normal");
      doc.setFont("NotoSansSC");
      
      // 标题
      doc.setFontSize(20);
      const title = translation.language === 'en' ? 'Quotation' : '报价单';
      doc.text(title, 105, 20, null, null, 'center');
      
      // 公司信息
      doc.setFontSize(12);
      doc.text(dataToExport.company_name || (translation.language === 'en' ? 'Foreign Trade Business Assistant' : '外贸业务助手'), 20, 35);
      const addressLabel = translation.language === 'en' ? 'Address: ' : '地址: ';
      doc.text(`${addressLabel}${dataToExport.company_address || (translation.language === 'en' ? 'Technology Park, Nanshan District, Shenzhen, China' : '中国深圳市南山区科技园')}`, 20, 45);
      const phoneLabel = translation.language === 'en' ? 'Phone: ' : '电话: ';
      doc.text(`${phoneLabel}${dataToExport.company_phone || '+86 123 4567 8900'}`, 20, 55);
      const emailLabel = translation.language === 'en' ? 'Email: ' : '邮箱: ';
      doc.text(`${emailLabel}${dataToExport.company_email || 'info@example.com'}`, 20, 65);
      
      // 报价单信息
      doc.setFontSize(10);
      const numberLabel = translation.language === 'en' ? 'Quotation No: ' : '报价单号: ';
      doc.text(`${numberLabel}${dataToExport.quotation_number}`, 120, 35);
      const dateLabel = translation.language === 'en' ? 'Date: ' : '日期: ';
      doc.text(`${dateLabel}${new Date(dataToExport.created_at).toLocaleDateString('zh-CN')}`, 120, 45);
      const validLabel = translation.language === 'en' ? 'Valid Until: ' : '有效期至: ';
      doc.text(`${validLabel}${dataToExport.valid_until || 'N/A'}`, 120, 55);
      const statusLabel = translation.language === 'en' ? 'Status: ' : '状态: ';
      doc.text(`${statusLabel}${dataToExport.status}`, 120, 65);
      
      // 客户信息
      const customer = customers?.find(c => c.id === dataToExport.customer_id);
      const customerLabel = translation.language === 'en' ? 'Customer: ' : '客户: ';
      doc.text(`${customerLabel}${customer?.company_name || 'N/A'}`, 20, 85);
      
      // 表格标题
      const startY = 100;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, startY, 170, 10, 'F');
      
      const indexLabel = translation.language === 'en' ? 'No.' : '序号';
      const descLabel = translation.language === 'en' ? 'Description' : '产品描述';
      const qtyLabel = translation.language === 'en' ? 'Qty' : '数量';
      const priceLabel = translation.language === 'en' ? 'Unit Price' : '单价';
      const totalLabel = translation.language === 'en' ? 'Total' : '总价';
      
      doc.text(indexLabel, 25, startY + 7);
      doc.text(descLabel, 40, startY + 7);
      doc.text(qtyLabel, 100, startY + 7);
      doc.text(priceLabel, 120, startY + 7);
      doc.text(totalLabel, 150, startY + 7);
      
      // 表格内容
      let currentY = startY + 10;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        doc.text((i + 1).toString(), 25, currentY + 7);
        doc.text(item.description || '-', 40, currentY + 7);
        doc.text((item.quantity || 0).toString(), 100, currentY + 7);
        doc.text(`${dataToExport.currency} ${item.unit_price.toFixed(2)}`, 120, currentY + 7);
        doc.text(`${dataToExport.currency} ${item.total_price.toFixed(2)}`, 150, currentY + 7);
        currentY += 10;
        
        // 如果有产品图片，添加到PDF中
        if (item.product_id) {
          const product = products?.find(p => p.id === item.product_id);
          if (product && product.image_url) {
            try {
              // 这里需要实际实现图片添加逻辑
              // 由于在浏览器环境中无法直接加载图片，这里仅作示意
              // 实际实现需要使用html2canvas或其他方式将图片转换为dataURL
            } catch (imgError) {
              console.warn('图片加载失败:', imgError);
            }
          }
        }
      }
      
      // 总计
      doc.setLineWidth(0.5);
      doc.line(120, currentY, 190, currentY);
      const totalLabelFinal = translation.language === 'en' ? 'Total: ' : '总计: ';
      doc.text(totalLabelFinal, 120, currentY + 10);
      doc.text(`${dataToExport.currency} ${dataToExport.total_amount.toFixed(2)}`, 150, currentY + 10);
      
      // 备注
      if (dataToExport.notes) {
        const notesLabel = translation.language === 'en' ? 'Notes: ' : '备注: ';
        doc.text(`${notesLabel}${dataToExport.notes}`, 20, currentY + 30);
      }
      
      // 保存PDF
      const filename = translation.language === 'en' ? 
        `Quotation-${dataToExport.quotation_number}.pdf` : 
        `报价单-${dataToExport.quotation_number}.pdf`;
      doc.save(filename);
      toast.success('PDF导出成功');
    } catch (error) {
      toast.error('导出失败: ' + error.message);
    }
  };

  // 过滤报价单数据
  const filteredQuotations = quotations?.filter(quotation => {
    const matchesSearch = 
      quotation.quotation_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quotation.customers?.company_name && quotation.customers.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case '草稿': return <Badge className="bg-gray-500">草稿</Badge>;
      case '已发送': return <Badge className="bg-blue-500">已发送</Badge>;
      case '已接受': return <Badge className="bg-green-500">已接受</Badge>;
      case '已拒绝': return <Badge className="bg-red-500">已拒绝</Badge>;
      default: return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  // 重新获取数据
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 添加自定义列
  const addCustomColumn = () => {
    const newColumn = {
      id: `custom_${Date.now()}`,
      name: `自定义列${customColumns.length + 1}`,
      visible: true
    };
    setCustomColumns(prev => [...prev, newColumn]);
  };

  // 更新自定义列
  const updateCustomColumn = (id, field, value) => {
    setCustomColumns(prev => 
      prev.map(col => 
        col.id === id ? { ...col, [field]: value } : col
      )
    );
  };

  // 删除自定义列
  const removeCustomColumn = (id) => {
    setCustomColumns(prev => prev.filter(col => col.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">报价单管理</h1>
          <p className="text-gray-500">创建和管理客户报价单</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              新增报价单
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuotation ? '编辑报价单' : '新增报价单'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 公司信息 */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">公司信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">公司名称</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="请输入公司名称"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_address">公司地址</Label>
                    <Input
                      id="company_address"
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleInputChange}
                      placeholder="请输入公司地址"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">联系电话</Label>
                    <Input
                      id="company_phone"
                      name="company_phone"
                      value={formData.company_phone}
                      onChange={handleInputChange}
                      placeholder="请输入联系电话"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_email">邮箱</Label>
                    <Input
                      id="company_email"
                      name="company_email"
                      type="email"
                      value={formData.company_email}
                      onChange={handleInputChange}
                      placeholder="请输入邮箱"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_logo">公司Logo</Label>
                    <Input
                      id="company_logo"
                      name="company_logo"
                      value={formData.company_logo}
                      onChange={handleInputChange}
                      placeholder="请输入Logo图片URL"
                    />
                  </div>
                </div>
              </div>
              
              {/* 报价单基本信息 */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">报价单信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">客户 *</Label>
                    <Select value={formData.customer_id || ''} onValueChange={handleCustomerChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="选择客户" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quotation_number">报价单号</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quotation_number"
                        name="quotation_number"
                        value={formData.quotation_number}
                        onChange={handleInputChange}
                        placeholder="请输入报价单号"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handleAutoGenerateNumber}>
                        自动生成
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">报价单标题</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="请输入报价单标题"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valid_until">有效期至</Label>
                    <Input
                      id="valid_until"
                      name="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">状态</Label>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="草稿">草稿</SelectItem>
                        <SelectItem value="已发送">已发送</SelectItem>
                        <SelectItem value="已接受">已接受</SelectItem>
                        <SelectItem value="已拒绝">已拒绝</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">货币</Label>
                    <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="CNY">CNY</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* 贸易条款 */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">贸易条款</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment_terms">付款方式</Label>
                    <Input
                      id="payment_terms"
                      name="payment_terms"
                      value={formData.payment_terms}
                      onChange={handleInputChange}
                      placeholder="请输入付款方式"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delivery_terms">交货期</Label>
                    <Input
                      id="delivery_terms"
                      name="delivery_terms"
                      value={formData.delivery_terms}
                      onChange={handleInputChange}
                      placeholder="请输入交货期"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping_method">运输方式</Label>
                    <Input
                      id="shipping_method"
                      name="shipping_method"
                      value={formData.shipping_method}
                      onChange={handleInputChange}
                      placeholder="请输入运输方式"
                    />
                  </div>
                </div>
              </div>
              
              {/* 客户信息 */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">客户信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_contact">联系人</Label>
                    <Input
                      id="customer_contact"
                      name="customer_contact"
                      value={formData.customer_contact}
                      onChange={handleInputChange}
                      placeholder="请输入联系人"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">联系电话</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="请输入联系电话"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">邮箱</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="请输入邮箱"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_address">地址</Label>
                    <Input
                      id="customer_address"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                      placeholder="请输入地址"
                    />
                  </div>
                </div>
              </div>
              
              {/* 报价项目 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>报价项目</Label>
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={addCustomColumn}>
                      添加自定义列
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={addQuotationItem}>
                      添加项目
                    </Button>
                  </div>
                </div>
                
                {/* 自定义列管理 */}
                {customColumns.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">自定义列管理</h4>
                    <div className="space-y-2">
                      {customColumns.map((column) => (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Input
                            value={column.name}
                            onChange={(e) => updateCustomColumn(column.id, 'name', e.target.value)}
                            placeholder="列名"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCustomColumn(column.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">序号</TableHead>
                        <TableHead>产品</TableHead>
                        <TableHead className="w-[200px]">描述 *</TableHead>
                        {customColumns.map(column => (
                          <TableHead key={column.id} className="w-[150px]">
                            {column.name}
                          </TableHead>
                        ))}
                        <TableHead className="w-[100px]">数量</TableHead>
                        <TableHead className="w-[120px]">单价</TableHead>
                        <TableHead className="w-[120px]">总价</TableHead>
                        <TableHead className="w-[50px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotationItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Select 
                              value={item.product_id || ''} 
                              onValueChange={(value) => updateQuotationItem(item.id, 'product_id', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="选择产品" />
                              </SelectTrigger>
                              <SelectContent>
                                {products?.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => updateQuotationItem(item.id, 'description', e.target.value)}
                              placeholder="请输入产品描述"
                              required
                            />
                          </TableCell>
                          {customColumns.map(column => (
                            <TableCell key={column.id}>
                              <Input
                                value={item[column.id] || ''}
                                onChange={(e) => updateQuotationItem(item.id, column.id, e.target.value)}
                                placeholder={column.name}
                              />
                            </TableCell>
                          ))}
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateQuotationItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateQuotationItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            {formData.currency} {(item.total_price || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeQuotationItem(item.id)}
                              disabled={quotationItems.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      总计: {formData.currency} {calculateTotalAmount().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="请输入备注信息"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit">
                  {editingQuotation ? '更新' : '创建'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索报价单号、标题、客户..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="报价单状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="已发送">已发送</SelectItem>
                  <SelectItem value="已接受">已接受</SelectItem>
                  <SelectItem value="已拒绝">已拒绝</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                更多筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 报价单列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            报价单列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>报价单号</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>总金额</TableHead>
                  <TableHead>创建日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations && filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                    <TableCell>{quotation.customers?.company_name || '未关联客户'}</TableCell>
                    <TableCell>{quotation.title || '-'}</TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      {quotation.currency} {parseFloat(quotation.total_amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(quotation.created_at).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">打开菜单</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(quotation)}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(quotation)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑报价单
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportPDF(quotation)}>
                            <Download className="mr-2 h-4 w-4" />
                            导出PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteQuotation(quotation.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除报价单
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {/* 当没有报价单数据时显示提示信息 */}
                {filteredQuotations && filteredQuotations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      暂无报价单数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 查看报价单详情对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
        setIsViewDialogOpen(open);
        if (!open) closeViewDialog();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>报价单详情</span>
              <div className="flex space-x-2">
                <Select value={translation.language} onValueChange={(value) => translateQuotation(viewingQuotation, value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportPDF(viewingQuotation, translation.language !== 'zh')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {viewingQuotation && (
            <div className="space-y-6" id={`quotation-${viewingQuotation.id}`}>
              {/* 报价单头部 */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    {/* 公司Logo */}
                    {translation.data?.company_logo || viewingQuotation.company_logo ? (
                      <img 
                        src={translation.data?.company_logo || viewingQuotation.company_logo} 
                        alt="Company Logo" 
                        className="h-16 mb-2 object-contain"
                      />
                    ) : null}
                    <h2 className="text-3xl font-bold">{translation.data?.company_name || viewingQuotation.company_name || '外贸业务助手'}</h2>
                    <p className="text-gray-600 mt-2">
                      {translation.language === 'en' ? 'Professional Foreign Trade Solutions Provider' : 
                       translation.language === 'de' ? 'Professioneller Außenhandelslösungsanbieter' :
                       translation.language === 'fr' ? 'Fournisseur professionnel de solutions de commerce extérieur' :
                       translation.language === 'es' ? 'Proveedor profesional de soluciones de comercio exterior' :
                       translation.language === 'ja' ? 'プロフェッショナルな輸出入ソリューションプロバイダー' :
                       '专业外贸解决方案提供商'}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>{translation.language === 'en' ? 'Address: ' : 
                          translation.language === 'de' ? 'Adresse: ' :
                          translation.language === 'fr' ? 'Adresse: ' :
                          translation.language === 'es' ? 'Dirección: ' :
                          translation.language === 'ja' ? '住所: ' :
                          '地址: '}{translation.data?.company_address || viewingQuotation.company_address || '中国深圳市南山区科技园'}</p>
                      <p>{translation.language === 'en' ? 'Phone: ' : 
                          translation.language === 'de' ? 'Telefon: ' :
                          translation.language === 'fr' ? 'Téléphone: ' :
                          translation.language === 'es' ? 'Teléfono: ' :
                          translation.language === 'ja' ? '電話: ' :
                          '电话: '}{translation.data?.company_phone || viewingQuotation.company_phone || '+86 123 4567 8900'}</p>
                      <p>{translation.language === 'en' ? 'Email: ' : 
                          translation.language === 'de' ? 'E-Mail: ' :
                          translation.language === 'fr' ? 'Email: ' :
                          translation.language === 'es' ? 'Correo electrónico: ' :
                          translation.language === 'ja' ? 'メール: ' :
                          '邮箱: '}{translation.data?.company_email || viewingQuotation.company_email || 'info@example.com'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block">
                      <h3 className="text-2xl font-bold">{translation.language === 'en' ? 'Quotation' : 
                                                          translation.language === 'de' ? 'Angebot' :
                                                          translation.language === 'fr' ? 'Devis' :
                                                          translation.language === 'es' ? 'Cotización' :
                                                          translation.language === 'ja' ? '見積書' :
                                                          '报价单'}</h3>
                    </div>
                    <div className="mt-4">
                      <p className="text-lg"><span className="font-semibold">{translation.language === 'en' ? 'No: ' : 
                                                                          translation.language === 'de' ? 'Nr: ' :
                                                                          translation.language === 'fr' ? 'N°: ' :
                                                                          translation.language === 'es' ? 'N°: ' :
                                                                          translation.language === 'ja' ? '番号: ' :
                                                                          '编号: '}</span> {translation.data?.quotation_number || viewingQuotation.quotation_number}</p>
                      <p className="text-lg mt-1"><span className="font-semibold">{translation.language === 'en' ? 'Date: ' : 
                                                                               translation.language === 'de' ? 'Datum: ' :
                                                                               translation.language === 'fr' ? 'Date: ' :
                                                                               translation.language === 'es' ? 'Fecha: ' :
                                                                               translation.language === 'ja' ? '日付: ' :
                                                                               '日期: '}</span> {new Date(viewingQuotation.created_at).toLocaleDateString('zh-CN')}</p>
                      <p className="text-lg mt-1"><span className="font-semibold">{translation.language === 'en' ? 'Valid Until: ' : 
                                                                                   translation.language === 'de' ? 'Gültig bis: ' :
                                                                                   translation.language === 'fr' ? 'Valable jusqu\'au: ' :
                                                                                   translation.language === 'es' ? 'Válido hasta: ' :
                                                                                   translation.language === 'ja' ? '有効期限: ' :
                                                                                   '有效期至: '}</span> {translation.data?.valid_until || viewingQuotation.valid_until || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 客户和报价单信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div>
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2">{translation.language === 'en' ? 'Customer Information' : 
                                                                           translation.language === 'de' ? 'Kundeninformation' :
                                                                           translation.language === 'fr' ? 'Informations client' :
                                                                           translation.language === 'es' ? 'Información del cliente' :
                                                                           translation.language === 'ja' ? '顧客情報' :
                                                                           '客户信息'}</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">{translation.language === 'en' ? 'Company: ' : 
                                                     translation.language === 'de' ? 'Firma: ' :
                                                     translation.language === 'fr' ? 'Société: ' :
                                                     translation.language === 'es' ? 'Empresa: ' :
                                                     translation.language === 'ja' ? '会社: ' :
                                                     '公司名称: '}</span> {customers?.find(c => c.id === viewingQuotation.customer_id)?.company_name || 'N/A'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Contact: ' : 
                                                     translation.language === 'de' ? 'Kontakt: ' :
                                                     translation.language === 'fr' ? 'Contact: ' :
                                                     translation.language === 'es' ? 'Contacto: ' :
                                                     translation.language === 'ja' ? '連絡先: ' :
                                                     '联系人: '}</span> {translation.data?.customer_contact || viewingQuotation.customer_contact || 'N/A'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Phone: ' : 
                                                     translation.language === 'de' ? 'Telefon: ' :
                                                     translation.language === 'fr' ? 'Téléphone: ' :
                                                     translation.language === 'es' ? 'Teléfono: ' :
                                                     translation.language === 'ja' ? '電話: ' :
                                                     '联系电话: '}</span> {translation.data?.customer_phone || viewingQuotation.customer_phone || 'N/A'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Email: ' : 
                                                     translation.language === 'de' ? 'E-Mail: ' :
                                                     translation.language === 'fr' ? 'Email: ' :
                                                     translation.language === 'es' ? 'Correo electrónico: ' :
                                                     translation.language === 'ja' ? 'メール: ' :
                                                     '邮箱: '}</span> {translation.data?.customer_email || viewingQuotation.customer_email || 'N/A'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Address: ' : 
                                                     translation.language === 'de' ? 'Adresse: ' :
                                                     translation.language === 'fr' ? 'Adresse: ' :
                                                     translation.language === 'es' ? 'Dirección: ' :
                                                     translation.language === 'ja' ? '住所: ' :
                                                     '地址: '}</span> {translation.data?.customer_address || viewingQuotation.customer_address || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2">{translation.language === 'en' ? 'Quotation Information' : 
                                                                           translation.language === 'de' ? 'Angebotsinformation' :
                                                                           translation.language === 'fr' ? 'Informations sur le devis' :
                                                                           translation.language === 'es' ? 'Información de cotización' :
                                                                           translation.language === 'ja' ? '見積情報' :
                                                                           '报价单信息'}</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">{translation.language === 'en' ? 'Status: ' : 
                                                     translation.language === 'de' ? 'Status: ' :
                                                     translation.language === 'fr' ? 'Statut: ' :
                                                     translation.language === 'es' ? 'Estado: ' :
                                                     translation.language === 'ja' ? '状態: ' :
                                                     '状态: '}</span> {getStatusBadge(translation.data?.status || viewingQuotation.status)}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Currency: ' : 
                                                     translation.language === 'de' ? 'Währung: ' :
                                                     translation.language === 'fr' ? 'Devise: ' :
                                                     translation.language === 'es' ? 'Moneda: ' :
                                                     translation.language === 'ja' ? '通貨: ' :
                                                     '货币: '}</span> {translation.data?.currency || viewingQuotation.currency}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Payment Terms: ' : 
                                                     translation.language === 'de' ? 'Zahlungsbedingungen: ' :
                                                     translation.language === 'fr' ? 'Modalités de paiement: ' :
                                                     translation.language === 'es' ? 'Términos de pago: ' :
                                                     translation.language === 'ja' ? '支払条件: ' :
                                                     '付款方式: '}</span> {translation.data?.payment_terms || viewingQuotation.payment_terms || 'T/T 30% 预付，70% 尾款'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Delivery Terms: ' : 
                                                     translation.language === 'de' ? 'Lieferbedingungen: ' :
                                                     translation.language === 'fr' ? 'Conditions de livraison: ' :
                                                     translation.language === 'es' ? 'Términos de entrega: ' :
                                                     translation.language === 'ja' ? '納期条件: ' :
                                                     '交货期: '}</span> {translation.data?.delivery_terms || viewingQuotation.delivery_terms || '收到预付款后 25-30 天'}</p>
                    <p><span className="font-medium">{translation.language === 'en' ? 'Shipping Method: ' : 
                                                     translation.language === 'de' ? 'Versandart: ' :
                                                     translation.language === 'fr' ? 'Méthode d\'expédition: ' :
                                                     translation.language === 'es' ? 'Método de envío: ' :
                                                     translation.language === 'ja' ? '輸送方法: ' :
                                                     '运输方式: '}</span> {translation.data?.shipping_method || viewingQuotation.shipping_method || '海运'}</p>
                  </div>
                </div>
              </div>
              
              {/* 产品明细 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center">{translation.language === 'en' ? 'No.' : 
                                                          translation.language === 'de' ? 'Nr.' :
                                                          translation.language === 'fr' ? 'N°' :
                                                          translation.language === 'es' ? 'N°' :
                                                          translation.language === 'ja' ? '番号' :
                                                          '序号'}</TableHead>
                      <TableHead>{translation.language === 'en' ? 'Description' : 
                                  translation.language === 'de' ? 'Beschreibung' :
                                  translation.language === 'fr' ? 'Description' :
                                  translation.language === 'es' ? 'Descripción' :
                                  translation.language === 'ja' ? '説明' :
                                  '产品描述'}</TableHead>
                      {customColumns.map(column => (
                        <TableHead key={column.id} className="text-center">
                          {translation.language === 'en' ? column.name : 
                           translation.language === 'de' ? column.name :
                           translation.language === 'fr' ? column.name :
                           translation.language === 'es' ? column.name :
                           translation.language === 'ja' ? column.name :
                           column.name}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">{translation.language === 'en' ? 'Quantity' : 
                                                          translation.language === 'de' ? 'Menge' :
                                                          translation.language === 'fr' ? 'Quantité' :
                                                          translation.language === 'es' ? 'Cantidad' :
                                                          translation.language === 'ja' ? '数量' :
                                                          '数量'}</TableHead>
                      <TableHead className="text-center">{translation.language === 'en' ? 'Unit' : 
                                                          translation.language === 'de' ? 'Einheit' :
                                                          translation.language === 'fr' ? 'Unité' :
                                                          translation.language === 'es' ? 'Unidad' :
                                                          translation.language === 'ja' ? '単位' :
                                                          '单位'}</TableHead>
                      <TableHead className="text-right">{translation.language === 'en' ? 'Unit Price' : 
                                                         translation.language === 'de' ? 'Stückpreis' :
                                                         translation.language === 'fr' ? 'Prix unitaire' :
                                                         translation.language === 'es' ? 'Precio unitario' :
                                                         translation.language === 'ja' ? '単価' :
                                                         '单价'}</TableHead>
                      <TableHead className="text-right">{translation.language === 'en' ? 'Total' : 
                                                         translation.language === 'de' ? 'Gesamt' :
                                                         translation.language === 'fr' ? 'Total' :
                                                         translation.language === 'es' ? 'Total' :
                                                         translation.language === 'ja' ? '合計' :
                                                         '总价'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(translation.data?.items || viewingQuotation.items)?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{item.description}</div>
                          {/* 产品图片 */}
                          {item.product_id && products?.find(p => p.id === item.product_id)?.image_url && (
                            <img 
                              src={products?.find(p => p.id === item.product_id)?.image_url} 
                              alt={item.description} 
                              className="mt-2 w-16 h-16 object-cover rounded"
                            />
                          )}
                        </TableCell>
                        {customColumns.map(column => (
                          <TableCell key={column.id} className="text-center">
                            {item[column.id] || 'N/A'}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">{translation.language === 'en' ? 'PCS' : 
                                                            translation.language === 'de' ? 'STK' :
                                                            translation.language === 'fr' ? 'PCS' :
                                                            translation.language === 'es' ? 'PCS' :
                                                            translation.language === 'ja' ? 'PCS' :
                                                            '件'}</TableCell>
                        <TableCell className="text-right">{(translation.data?.currency || viewingQuotation.currency)} {item.unit_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{(translation.data?.currency || viewingQuotation.currency)} {item.total_price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* 总计和条款 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div>
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2">{translation.language === 'en' ? 'Terms and Conditions' : 
                                                                           translation.language === 'de' ? 'Allgemeine Geschäftsbedingungen' :
                                                                           translation.language === 'fr' ? 'Termes et conditions' :
                                                                           translation.language === 'es' ? 'Términos y condiciones' :
                                                                           translation.language === 'ja' ? '契約条件' :
                                                                           '条款和条件'}</h4>
                  <div className="space-y-2 text-sm">
                    <p>1. {translation.language === 'en' ? 'Price Validity: 15 days' : 
                          translation.language === 'de' ? 'Preisgültigkeit: 15 Tage' :
                          translation.language === 'fr' ? 'Validité du prix: 15 jours' :
                          translation.language === 'es' ? 'Validez del precio: 15 días' :
                          translation.language === 'ja' ? '価格有効期限: 15日間' :
                          '价格有效期: 15天'}</p>
                    <p>2. {translation.language === 'en' ? 'Payment Terms: ' : 
                          translation.language === 'de' ? 'Zahlungsbedingungen: ' :
                          translation.language === 'fr' ? 'Modalités de paiement: ' :
                          translation.language === 'es' ? 'Términos de pago: ' :
                          translation.language === 'ja' ? '支払条件: ' :
                          '付款方式: '}{translation.data?.payment_terms || viewingQuotation.payment_terms || 'T/T 30% 预付，70% 尾款'}</p>
                    <p>3. {translation.language === 'en' ? 'Delivery Terms: ' : 
                          translation.language === 'de' ? 'Lieferbedingungen: ' :
                          translation.language === 'fr' ? 'Conditions de livraison: ' :
                          translation.language === 'es' ? 'Términos de entrega: ' :
                          translation.language === 'ja' ? '納期条件: ' :
                          '交货期: '}{translation.data?.delivery_terms || viewingQuotation.delivery_terms || '收到预付款后 25-30 天'}</p>
                    <p>4. {translation.language === 'en' ? 'Packaging: Standard export packaging' : 
                          translation.language === 'de' ? 'Verpackung: Standard-Exportverpackung' :
                          translation.language === 'fr' ? 'Emballage: Emballage d\'exportation standard' :
                          translation.language === 'es' ? 'Empaque: Embalaje de exportación estándar' :
                          translation.language === 'ja' ? '包装: 標準輸出包装' :
                          '包装: 标准出口包装'}</p>
                    <p>5. {translation.language === 'en' ? 'Shipping: ' : 
                          translation.language === 'de' ? 'Versand: ' :
                          translation.language === 'fr' ? 'Expédition: ' :
                          translation.language === 'es' ? 'Envío: ' :
                          translation.language === 'ja' ? '輸送: ' :
                          '运输: '}{translation.data?.shipping_method || viewingQuotation.shipping_method || '海运'}</p>
                    <p>6. {translation.language === 'en' ? 'Insurance: Buyer\'s responsibility' : 
                          translation.language === 'de' ? 'Versicherung: Käuferverantwortung' :
                          translation.language === 'fr' ? 'Assurance: Responsabilité de l\'acheteur' :
                          translation.language === 'es' ? 'Seguro: Responsabilidad del comprador' :
                          translation.language === 'ja' ? '保険: 買主の責任' :
                          '保险: 由买方负责'}</p>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between py-2">
                      <span>{translation.language === 'en' ? 'Subtotal: ' : 
                            translation.language === 'de' ? 'Zwischensumme: ' :
                            translation.language === 'fr' ? 'Sous-total: ' :
                            translation.language === 'es' ? 'Subtotal: ' :
                            translation.language === 'ja' ? '小計: ' :
                            '小计: '}</span>
                      <span>{(translation.data?.currency || viewingQuotation.currency)} {(translation.data?.total_amount || viewingQuotation.total_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>{translation.language === 'en' ? 'Shipping: ' : 
                            translation.language === 'de' ? 'Versand: ' :
                            translation.language === 'fr' ? 'Expédition: ' :
                            translation.language === 'es' ? 'Envío: ' :
                            translation.language === 'ja' ? '送料: ' :
                            '运费: '}</span>
                      <span>{(translation.data?.currency || viewingQuotation.currency)} 0.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>{translation.language === 'en' ? 'Insurance: ' : 
                            translation.language === 'de' ? 'Versicherung: ' :
                            translation.language === 'fr' ? 'Assurance: ' :
                            translation.language === 'es' ? 'Seguro: ' :
                            translation.language === 'ja' ? '保険: ' :
                            '保险费: '}</span>
                      <span>{(translation.data?.currency || viewingQuotation.currency)} 0.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-t mt-2 font-bold text-lg">
                      <span>{translation.language === 'en' ? 'Total: ' : 
                            translation.language === 'de' ? 'Gesamt: ' :
                            translation.language === 'fr' ? 'Total: ' :
                            translation.language === 'es' ? 'Total: ' :
                            translation.language === 'ja' ? '合計: ' :
                            '总计: '}</span>
                      <span>{(translation.data?.currency || viewingQuotation.currency)} {(translation.data?.total_amount || viewingQuotation.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 备注 */}
              <div className="py-6">
                <h4 className="text-xl font-semibold mb-4 border-b pb-2">{translation.language === 'en' ? 'Notes' : 
                                                                         translation.language === 'de' ? 'Anmerkungen' :
                                                                         translation.language === 'fr' ? 'Notes' :
                                                                         translation.language === 'es' ? 'Notas' :
                                                                         translation.language === 'ja' ? '備考' :
                                                                         '备注'}</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{translation.data?.notes || viewingQuotation.notes || '无备注'}</p>
              </div>
              
              {/* 签章区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t">
                <div>
                  <h4 className="font-semibold mb-2">{translation.language === 'en' ? 'Seller Signature' : 
                                                     translation.language === 'de' ? 'Unterschrift des Verkäufers' :
                                                     translation.language === 'fr' ? 'Signature du vendeur' :
                                                     translation.language === 'es' ? 'Firma del vendedor' :
                                                     translation.language === 'ja' ? '販売者署名' :
                                                     '卖方签章'}</h4>
                  <div className="h-24 border rounded-lg flex items-center justify-center text-gray-400">
                    {translation.language === 'en' ? 'Company stamp and authorized signature' : 
                     translation.language === 'de' ? 'Firmenstempel und autorisierte Unterschrift' :
                     translation.language === 'fr' ? 'Cachet de l\'entreprise et signature autorisée' :
                     translation.language === 'es' ? 'Sello de la empresa y firma autorizada' :
                     translation.language === 'ja' ? '会社印と承認された署名' :
                     '公司签章和经办人签名'}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{translation.language === 'en' ? 'Buyer Signature' : 
                                                     translation.language === 'de' ? 'Unterschrift des Käufers' :
                                                     translation.language === 'fr' ? 'Signature de l\'acheteur' :
                                                     translation.language === 'es' ? 'Firma del comprador' :
                                                     translation.language === 'ja' ? '購入者署名' :
                                                     '买方签章'}</h4>
                  <div className="h-24 border rounded-lg flex items-center justify-center text-gray-400">
                    {translation.language === 'en' ? 'Customer stamp' : 
                     translation.language === 'de' ? 'Kundenstempel' :
                     translation.language === 'fr' ? 'Cachet du client' :
                     translation.language === 'es' ? 'Sello del cliente' :
                     translation.language === 'ja' ? '顧客印' :
                     '客户签章'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={closeViewDialog}>
                  {translation.language === 'en' ? 'Close' : 
                   translation.language === 'de' ? 'Schließen' :
                   translation.language === 'fr' ? 'Fermer' :
                   translation.language === 'es' ? 'Cerrar' :
                   translation.language === 'ja' ? '閉じる' :
                   '关闭'}
                </Button>
                <Button onClick={() => handleExportPDF(viewingQuotation, translation.language !== 'zh')}>
                  <Download className="mr-2 h-4 w-4" />
                  {translation.language === 'en' ? 'Export PDF' : 
                   translation.language === 'de' ? 'PDF exportieren' :
                   translation.language === 'fr' ? 'Exporter en PDF' :
                   translation.language === 'es' ? 'Exportar PDF' :
                   translation.language === 'ja' ? 'PDFをエクスポート' :
                   '导出PDF'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quotations;
