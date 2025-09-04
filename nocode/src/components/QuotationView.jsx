import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableRoot } from '@/components/ui/table';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { DialogContent, DialogTitle, Dialog, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SelectItem, Select, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Languages, Edit, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addChineseFont } from '../font'; 

const QuotationView = ({ 
  isOpen, 
  onClose, 
  quotation, 
  customers,
  products,
  customColumns = []
}) => {
  const [translation, setTranslation] = useState({
    language: 'zh',
    data: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

  if (!quotation) return null;

  // 初始化可编辑数据
  React.useEffect(() => {
    if (quotation) {
      setEditableData({
        company_name: quotation.company_name || '外贸业务助手',
        company_address: quotation.company_address || '中国深圳市南山区科技园',
        company_phone: quotation.company_phone || '+86 123 4567 8900',
        company_email: quotation.company_email || 'info@example.com',
        company_logo: quotation.company_logo || '',
        payment_terms: quotation.payment_terms || 'T/T 30% 预付，70% 尾款',
        delivery_terms: quotation.delivery_terms || '收到预付款后 25-30 天',
        shipping_method: quotation.shipping_method || '海运',
        customer_contact: quotation.customer_contact || '',
        customer_phone: quotation.customer_phone || '',
        customer_email: quotation.customer_email || '',
        customer_address: quotation.customer_address || '',
        notes: quotation.notes || ''
      });
    }
  }, [quotation]);

  const getStatusBadge = (status) => {
    switch (status) {
      case '草稿': return <Badge className="bg-gray-500">草稿</Badge>;
      case '已发送': return <Badge className="bg-blue-500">已发送</Badge>;
      case '已接受': return <Badge className="bg-green-500">已接受</Badge>;
      case '已拒绝': return <Badge className="bg-red-500">已拒绝</Badge>;
      default: return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  // 翻译报价单内容
  const translateQuotation = async (quotation, targetLang) => {
    try {
      // 这里模拟翻译过程，实际应用中可以调用翻译API
      const translatedData = {
        ...editableData,
        company_name: targetLang === 'en' ? 'Foreign Trade Business Assistant' : 
                     targetLang === 'de' ? 'Außenhandelsgeschäftsassistent' :
                     targetLang === 'fr' ? 'Assistant commercial à l\'étranger' :
                     targetLang === 'es' ? 'Asistente de comercio exterior' :
                     targetLang === 'ja' ? '輸出入ビジネスアシスタント' :
                     editableData.company_name,
        company_address: targetLang === 'en' ? 'Technology Park, Nanshan District, Shenzhen, China' : 
                        targetLang === 'de' ? 'Technologiepark, Nanshan-Distrikt, Shenzhen, China' :
                        targetLang === 'fr' ? 'Parc technologique, district de Nanshan, Shenzhen, Chine' :
                        targetLang === 'es' ? 'Parque tecnológico, distrito de Nanshan, Shenzhen, China' :
                        targetLang === 'ja' ? '中国深圳市南山区科技园' :
                        editableData.company_address,
        payment_terms: targetLang === 'en' ? 'T/T 30% in advance, 70% balance' : 
                      targetLang === 'de' ? 'T/T 30% im Voraus, 70% Saldo' :
                      targetLang === 'fr' ? 'T/T 30% d\'avance, 70% solde' :
                      targetLang === 'es' ? 'T/T 30% por adelantado, 70% saldo' :
                      targetLang === 'ja' ? 'T/T 30%前払い、70%残金' :
                      editableData.payment_terms,
        delivery_terms: targetLang === 'en' ? '25-30 days after receiving advance payment' : 
                       targetLang === 'de' ? '25-30 Tage nach Erhalt der Anzahlung' :
                       targetLang === 'fr' ? '25-30 jours après réception du paiement anticipé' :
                       targetLang === 'es' ? '25-30 días después de recibir el pago anticipado' :
                       targetLang === 'ja' ? '前払い受領後25-30日' :
                       editableData.delivery_terms,
        shipping_method: targetLang === 'en' ? 'Sea Shipping' : 
                        targetLang === 'de' ? 'Seefracht' :
                        targetLang === 'fr' ? 'Expédition maritime' :
                        targetLang === 'es' ? 'Envío marítimo' :
                        targetLang === 'ja' ? '海上輸送' :
                        editableData.shipping_method,
        items: quotation.items?.map(item => ({
          ...item,
          description: targetLang === 'en' ? `Product: ${item.description}` : 
                      targetLang === 'de' ? `Produkt: ${item.description}` :
                      targetLang === 'fr' ? `Produit: ${item.description}` :
                      targetLang === 'es' ? `Producto: ${item.description}` :
                      targetLang === 'ja' ? `製品: ${item.description}` :
                      item.description
        })) || []
      };
      
      setTranslation({
        language: targetLang,
        data: translatedData
      });
      
      toast.success(`报价单已翻译为${targetLang === 'en' ? '英文' : 
                                    targetLang === 'de' ? '德语' :
                                    targetLang === 'fr' ? '法语' :
                                    targetLang === 'es' ? '西班牙语' :
                                    targetLang === 'ja' ? '日语' :
                                    '中文'}`);
    } catch (error) {
      toast.error('翻译失败: ' + error.message);
    }
  };

  // 处理编辑字段变化
  const handleEditChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 保存编辑
  const handleSaveEdit = () => {
    setIsEditing(false);
    // 在实际应用中，这里应该调用API保存数据
    toast.success('修改已保存');
  };

  // 导出PDF
  const handleExportPDF = async (quotation) => {
    try {
      const isChinese = translation.language === 'zh';
      const dataToExport = translation.data || editableData;
      
      if (!quotation.items || quotation.items.length === 0) {
        toast.error('报价单项目数据缺失，无法导出。');
        return;
      }

      const doc = new jsPDF();

      // 字体加载与诊断
      if (isChinese) {
        console.log("检测到中文，正在尝试加载自定义字体...");
        addChineseFont(doc);
        doc.setFont("SourceHanSans");
      } else {
        // 对于非中文，明确设置使用 jsPDF 的内置字体
        doc.setFont("helvetica");
      }

      // PDF 内容
      // 标题
      doc.setFontSize(20);
      const title = isChinese ? '报价单' : 'Quotation';
      doc.text(title, 105, 20, { align: 'center' });

      // 公司信息 (简化示例)
      doc.setFontSize(12);
      doc.text(dataToExport.company_name || '', 20, 35);
      doc.text(dataToExport.company_address || '', 20, 45);

      // 客户信息 (简化示例)
      doc.text(`客户: ${customers?.find(c => c.id === quotation.customer_id)?.company_name || 'N/A'}`, 20, 85);
      
      // 使用 jspdf-autotable 创建表格
      const head = [
          isChinese ? ['序号', '产品描述', '数量', '单价', '总价'] : ['No.', 'Description', 'Qty', 'Unit Price', 'Total']
      ];
      const body = quotation.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        `${quotation.currency} ${item.unit_price.toFixed(2)}`,
        `${quotation.currency} ${item.total_price.toFixed(2)}`
      ]);

      doc.autoTable({
        startY: 100,
        head: head,
        body: body,
        styles: {
          font: isChinese ? "NotoSansSC" : "helvetica", // 为表格动态设置字体
          fontStyle: 'normal',
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: 0
        }
      });

      const finalY = doc.lastAutoTable.finalY; // 获取表格结束的位置

      // 总计
      doc.setFontSize(12);
      const totalLabel = isChinese ? '总计:' : 'Total:';
      doc.text(totalLabel, 120, finalY + 15);
      doc.text(`${quotation.currency} ${quotation.total_amount.toFixed(2)}`, 150, finalY + 15);

      // 保存文件
      const filename = `${isChinese ? '报价单' : 'Quotation'}-${quotation.quotation_number}.pdf`;
      doc.save(filename);
      toast.success('PDF 导出成功！');

    } catch (error) {
      console.error("导出PDF时发生严重错误:", error);
      toast.error(`导出失败: ${error.message}`);
    }
  };

  const dataToDisplay = translation.data || editableData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex justify-between items-center">
            <span>报价单详情</span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? '保存' : '编辑'}
              </Button>
              <Select value={translation.language} onValueChange={(value) => translateQuotation(quotation, value)}>
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
                onClick={() => handleExportPDF(quotation)}
              >
                <Download className="mr-2 h-4 w-4" />
                导出PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6" id={`quotation-${quotation.id}`}>
          {/* 报价单头部 */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                {/* 公司Logo */}
                {dataToDisplay.company_logo && (
                  <img 
                    src={dataToDisplay.company_logo} 
                    alt="Company Logo" 
                    className="h-16 mb-2 object-contain"
                  />
                )}
                {isEditing ? (
                  <Input
                    value={dataToDisplay.company_name}
                    onChange={(e) => handleEditChange('company_name', e.target.value)}
                    className="text-3xl font-bold"
                  />
                ) : (
                  <h2 className="text-3xl font-bold">{dataToDisplay.company_name}</h2>
                )}
                <p className="text-gray-600 mt-2">
                  {translation.language === 'en' ? 'Professional Foreign Trade Solutions Provider' : 
                   translation.language === 'de' ? 'Professioneller Außenhandelslösungsanbieter' :
                   translation.language === 'fr' ? 'Fournisseur professionnel de solutions de commerce extérieur' :
                   translation.language === 'es' ? 'Proveedor profesional de soluciones de comercio exterior' :
                   translation.language === 'ja' ? 'プロフェッショナルな輸出入ソリューションプロバイダー' :
                   '专业外贸解决方案提供商'}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    {translation.language === 'en' ? 'Address: ' : 
                     translation.language === 'de' ? 'Adresse: ' :
                     translation.language === 'fr' ? 'Adresse: ' :
                     translation.language === 'es' ? 'Dirección: ' :
                     translation.language === 'ja' ? '住所: ' :
                     '地址: '}
                    {isEditing ? (
                      <Input
                        value={dataToDisplay.company_address}
                        onChange={(e) => handleEditChange('company_address', e.target.value)}
                        className="inline-block w-60"
                      />
                    ) : (
                      dataToDisplay.company_address
                    )}
                  </p>
                  <p>
                    {translation.language === 'en' ? 'Phone: ' : 
                     translation.language === 'de' ? 'Telefon: ' :
                     translation.language === 'fr' ? 'Téléphone: ' :
                     translation.language === 'es' ? 'Teléfono: ' :
                     translation.language === 'ja' ? '電話: ' :
                     '电话: '}
                    {isEditing ? (
                      <Input
                        value={dataToDisplay.company_phone}
                        onChange={(e) => handleEditChange('company_phone', e.target.value)}
                        className="inline-block w-40"
                      />
                    ) : (
                      dataToDisplay.company_phone
                    )}
                  </p>
                  <p>
                    {translation.language === 'en' ? 'Email: ' : 
                     translation.language === 'de' ? 'E-Mail: ' :
                     translation.language === 'fr' ? 'Email: ' :
                     translation.language === 'es' ? 'Correo electrónico: ' :
                     translation.language === 'ja' ? 'メール: ' :
                     '邮箱: '}
                    {isEditing ? (
                      <Input
                        value={dataToDisplay.company_email}
                        onChange={(e) => handleEditChange('company_email', e.target.value)}
                        className="inline-block w-40"
                      />
                    ) : (
                      dataToDisplay.company_email
                    )}
                  </p>
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
                                                                      '编号: '}</span> {quotation.quotation_number}</p>
                  <p className="text-lg mt-1"><span className="font-semibold">{translation.language === 'en' ? 'Date: ' : 
                                                                           translation.language === 'de' ? 'Datum: ' :
                                                                           translation.language === 'fr' ? 'Date: ' :
                                                                           translation.language === 'es' ? 'Fecha: ' :
                                                                           translation.language === 'ja' ? '日付: ' :
                                                                           '日期: '}</span> {new Date(quotation.created_at).toLocaleDateString('zh-CN')}</p>
                  <p className="text-lg mt-1"><span className="font-semibold">{translation.language === 'en' ? 'Valid Until: ' : 
                                                                               translation.language === 'de' ? 'Gültig bis: ' :
                                                                               translation.language === 'fr' ? 'Valable jusqu\'au: ' :
                                                                               translation.language === 'es' ? 'Válido hasta: ' :
                                                                               translation.language === 'ja' ? '有効期限: ' :
                                                                               '有效期至: '}</span> {quotation.valid_until || 'N/A'}</p>
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
                                                 '公司名称: '}</span> {customers?.find(c => c.id === quotation.customer_id)?.company_name || 'N/A'}</p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Contact: ' : 
                                                 translation.language === 'de' ? 'Kontakt: ' :
                                                 translation.language === 'fr' ? 'Contact: ' :
                                                 translation.language === 'es' ? 'Contacto: ' :
                                                 translation.language === 'ja' ? '連絡先: ' :
                                                 '联系人: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.customer_contact}
                      onChange={(e) => handleEditChange('customer_contact', e.target.value)}
                      className="inline-block w-40"
                    />
                  ) : (
                    dataToDisplay.customer_contact || 'N/A'
                  )}
                </p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Phone: ' : 
                                                 translation.language === 'de' ? 'Telefon: ' :
                                                 translation.language === 'fr' ? 'Téléphone: ' :
                                                 translation.language === 'es' ? 'Teléfono: ' :
                                                 translation.language === 'ja' ? '電話: ' :
                                                 '联系电话: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.customer_phone}
                      onChange={(e) => handleEditChange('customer_phone', e.target.value)}
                      className="inline-block w-40"
                    />
                  ) : (
                    dataToDisplay.customer_phone || 'N/A'
                  )}
                </p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Email: ' : 
                                                 translation.language === 'de' ? 'E-Mail: ' :
                                                 translation.language === 'fr' ? 'Email: ' :
                                                 translation.language === 'es' ? 'Correo electrónico: ' :
                                                 translation.language === 'ja' ? 'メール: ' :
                                                 '邮箱: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.customer_email}
                      onChange={(e) => handleEditChange('customer_email', e.target.value)}
                      className="inline-block w-40"
                    />
                  ) : (
                    dataToDisplay.customer_email || 'N/A'
                  )}
                </p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Address: ' : 
                                                 translation.language === 'de' ? 'Adresse: ' :
                                                 translation.language === 'fr' ? 'Adresse: ' :
                                                 translation.language === 'es' ? 'Dirección: ' :
                                                 translation.language === 'ja' ? '住所: ' :
                                                 '地址: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.customer_address}
                      onChange={(e) => handleEditChange('customer_address', e.target.value)}
                      className="inline-block w-60"
                    />
                  ) : (
                    dataToDisplay.customer_address || 'N/A'
                  )}
                </p>
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
                                                 '状态: '}</span> {getStatusBadge(quotation.status)}</p>
                <p><span className="font-medium">{translation.language === 'en' ? 'Currency: ' : 
                                                 translation.language === 'de' ? 'Währung: ' :
                                                 translation.language === 'fr' ? 'Devise: ' :
                                                 translation.language === 'es' ? 'Moneda: ' :
                                                 translation.language === 'ja' ? '通貨: ' :
                                                 '货币: '}</span> {quotation.currency}</p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Payment Terms: ' : 
                                                 translation.language === 'de' ? 'Zahlungsbedingungen: ' :
                                                 translation.language === 'fr' ? 'Modalités de paiement: ' :
                                                 translation.language === 'es' ? 'Términos de pago: ' :
                                                 translation.language === 'ja' ? '支払条件: ' :
                                                 '付款方式: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.payment_terms}
                      onChange={(e) => handleEditChange('payment_terms', e.target.value)}
                      className="inline-block w-60"
                    />
                  ) : (
                    dataToDisplay.payment_terms
                  )}
                </p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Delivery Terms: ' : 
                                                 translation.language === 'de' ? 'Lieferbedingungen: ' :
                                                 translation.language === 'fr' ? 'Conditions de livraison: ' :
                                                 translation.language === 'es' ? 'Términos de entrega: ' :
                                                 translation.language === 'ja' ? '納期条件: ' :
                                                 '交货期: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.delivery_terms}
                      onChange={(e) => handleEditChange('delivery_terms', e.target.value)}
                      className="inline-block w-60"
                    />
                  ) : (
                    dataToDisplay.delivery_terms
                  )}
                </p>
                <p>
                  <span className="font-medium">{translation.language === 'en' ? 'Shipping Method: ' : 
                                                 translation.language === 'de' ? 'Versandart: ' :
                                                 translation.language === 'fr' ? 'Méthode d\'expédition: ' :
                                                 translation.language === 'es' ? 'Método de envío: ' :
                                                 translation.language === 'ja' ? '輸送方法: ' :
                                                 '运输方式: '}</span> 
                  {isEditing ? (
                    <Input
                      value={dataToDisplay.shipping_method}
                      onChange={(e) => handleEditChange('shipping_method', e.target.value)}
                      className="inline-block w-40"
                    />
                  ) : (
                    dataToDisplay.shipping_method
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* 产品明细 */}
          <div className="border rounded-lg overflow-hidden">
            <TableRoot>
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
                  {quotation.items?.map((item, index) => (
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
                      <TableCell className="text-right">{quotation.currency} {item.unit_price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{quotation.currency} {item.total_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableRoot>
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
                      '付款方式: '}{dataToDisplay.payment_terms}</p>
                <p>3. {translation.language === 'en' ? 'Delivery Terms: ' : 
                      translation.language === 'de' ? 'Lieferbedingungen: ' :
                      translation.language === 'fr' ? 'Conditions de livraison: ' :
                      translation.language === 'es' ? 'Términos de entrega: ' :
                      translation.language === 'ja' ? '納期条件: ' :
                      '交货期: '}{dataToDisplay.delivery_terms}</p>
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
                      '运输: '}{dataToDisplay.shipping_method}</p>
                <p>6. {translation.language === 'en' ? 'Insurance: Buyer\'s responsibility' : 
                      translation.language === 'de' ? 'Versicherung: Käuferverantwortung' :
                      translation.language === 'fr' ? 'Assurance: Responsabilité de l\'acheteur' :
                      translation.language === 'es' ? 'Seguro: Responsabilidad del comprador' :
                      translation.language === 'ja' ? '保険: 買主の責任' :
                      '保险: 由买方负责'}</p>
              </div>
              {/* 可编辑的条款和条件 */}
              {isEditing && (
                <div className="mt-4">
                  <Label>条款和条件</Label>
                  <Textarea
                    value={dataToDisplay.terms_and_conditions || ''}
                    onChange={(e) => handleEditChange('terms_and_conditions', e.target.value)}
                    rows={6}
                    placeholder="请输入条款和条件，每行一条"
                  />
                </div>
              )}
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
                  <span>{quotation.currency} {quotation.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>{translation.language === 'en' ? 'Shipping: ' : 
                        translation.language === 'de' ? 'Versand: ' :
                        translation.language === 'fr' ? 'Expédition: ' :
                        translation.language === 'es' ? 'Envío: ' :
                        translation.language === 'ja' ? '送料: ' :
                        '运费: '}</span>
                  <span>{quotation.currency} 0.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>{translation.language === 'en' ? 'Insurance: ' : 
                        translation.language === 'de' ? 'Versicherung: ' :
                        translation.language === 'fr' ? 'Assurance: ' :
                        translation.language === 'es' ? 'Seguro: ' :
                        translation.language === 'ja' ? '保険: ' :
                        '保险费: '}</span>
                  <span>{quotation.currency} 0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t mt-2 font-bold text-lg">
                  <span>{translation.language === 'en' ? 'Total: ' : 
                        translation.language === 'de' ? 'Gesamt: ' :
                        translation.language === 'fr' ? 'Total: ' :
                        translation.language === 'es' ? 'Total: ' :
                        translation.language === 'ja' ? '合計: ' :
                        '总计: '}</span>
                  <span>{quotation.currency} {quotation.total_amount.toFixed(2)}</span>
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
            {isEditing ? (
              <Textarea
                value={dataToDisplay.notes}
                onChange={(e) => handleEditChange('notes', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">{dataToDisplay.notes}</p>
            )}
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
            <Button variant="outline" onClick={onClose}>
              {translation.language === 'en' ? 'Close' : 
               translation.language === 'de' ? 'Schließen' :
               translation.language === 'fr' ? 'Fermer' :
               translation.language === 'es' ? 'Cerrar' :
               translation.language === 'ja' ? '閉じる' :
               '关闭'}
            </Button>
            <Button onClick={() => handleExportPDF(quotation)}>
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
      </DialogContent>
    </Dialog>
  );
};

export default QuotationView;
