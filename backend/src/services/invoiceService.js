import supabase from "../config/supabase.js";
import pool from "../config/db.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generateInvoices = async (orderId) => {
  const { rows: orderRows } = await pool.query(
    "SELECT orders.*, clients.company_name, clients.contact_name, clients.email, clients.currency FROM orders INNER JOIN clients ON orders.client_id = clients.id WHERE orders.id = $1",
    [orderId],
  );
  if (!orderRows[0]) return null;
  
  const { rows: items } = await pool.query(
    "SELECT oi.quantity, oi.unit_price_at_time, p.name AS product_name FROM order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
    [orderId],
  );
  
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.unit_price_at_time) || 0;
    const qty = parseInt(item.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const order = orderRows[0];
  
  // Colors
  const primaryColor = rgb(0.15, 0.45, 0.75);
  const secondaryColor = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.96, 0.96, 0.96);
  const darkGray = rgb(0.2, 0.2, 0.2);
  
  // Header with border bottom
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryColor,
  });
  
  // INVOICE title
  page.drawText("INVOICE", {
    x: 50,
    y: height - 55,
    size: 36,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  
  // Order info
  page.drawText(`Order #${order.id}`, {
    x: width - 180,
    y: height - 50,
    size: 13,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, {
    x: width - 180,
    y: height - 70,
    size: 11,
    font,
    color: rgb(0.9, 0.9, 0.9),
  });
  
  // Client section with better layout
  let yPos = height - 180;
  
  // "Bill To" label with underline
  page.drawText("BILL TO:", {
    x: 50,
    y: yPos,
    size: 10,
    font: fontBold,
    color: secondaryColor,
  });
  
  // Draw line under "BILL TO"
  page.drawLine({
    start: { x: 50, y: yPos - 8 },
    end: { x: 120, y: yPos - 8 },
    thickness: 1.5,
    color: primaryColor,
  });
  
  // Company or Contact name (whichever exists)
  const displayName = order.company_name || order.contact_name || "Valued Customer";
  page.drawText(displayName, {
    x: 50,
    y: yPos - 30,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  
  // Contact name if different from company
  if (order.contact_name && order.company_name) {
    page.drawText(`Attn: ${order.contact_name}`, {
      x: 50,
      y: yPos - 50,
      size: 11,
      font,
      color: darkGray,
    });
    yPos = yPos - 20;
  }
  
  // Email
  if (order.email) {
    page.drawText(order.email, {
      x: 50,
      y: yPos - (order.company_name ? 70 : 50),
      size: 11,
      font,
      color: darkGray,
    });
  }
  
  // Table header with better styling
  const tableY = height - 300;
  
  // Draw table header background
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: width - 100,
    height: 30,
    color: lightGray,
  });
  
  // Table headers with better alignment
  page.drawText("ITEM DESCRIPTION", { x: 50, y: tableY + 16, size: 10, font: fontBold, color: secondaryColor });
  page.drawText("QTY", { x: 320, y: tableY + 16, size: 10, font: fontBold, color: secondaryColor });
  page.drawText("UNIT PRICE", { x: 410, y: tableY + 16, size: 10, font: fontBold, color: secondaryColor });
  page.drawText("AMOUNT", { x: 510, y: tableY + 16, size: 10, font: fontBold, color: secondaryColor });
  
  // Line under header
  page.drawLine({
    start: { x: 50, y: tableY },
    end: { x: width - 50, y: tableY },
    thickness: 2,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  // Items with alternating row colors
  let y = tableY - 25;
  items.forEach((item, index) => {
    const unitPrice = parseFloat(item.unit_price_at_time) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const subtotal = unitPrice * quantity;
    
    // Alternating row background
    if (index % 2 === 0) {
      page.drawRectangle({
        x: 50,
        y: y - 5,
        width: width - 100,
        height: 20,
        color: rgb(0.98, 0.98, 0.98),
      });
    }
    
    page.drawText(item.product_name, { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
    page.drawText(String(quantity), { x: 320, y, size: 11, font, color: darkGray });
    page.drawText(`${order.currency} ${unitPrice.toFixed(2)}`, {
      x: 410,
      y,
      size: 11,
      font,
      color: darkGray,
    });
    page.drawText(`${order.currency} ${subtotal.toFixed(2)}`, {
      x: 510,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    
    y -= 30;
  });
  
  // Final line before total
  page.drawLine({
    start: { x: 50, y: y + 10 },
    end: { x: width - 50, y: y + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Total section with background
  const totalY = y - 20;
  page.drawRectangle({
    x: 350,
    y: totalY - 10,
    width: width - 400,
    height: 35,
    color: lightGray,
  });
  
  page.drawText("TOTAL:", {
    x: 410,
    y: totalY + 12,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });
  page.drawText(`${order.currency} ${total.toFixed(2)}`, {
    x: 510,
    y: totalY + 12,
    size: 16,
    font: fontBold,
    color: primaryColor,
  });
  
  // Footer
  const footerY = 100;
  page.drawLine({
    start: { x: 50, y: footerY + 30 },
    end: { x: width - 50, y: footerY + 30 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });
  
  page.drawText("Thank you for your business!", {
    x: 50,
    y: footerY,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });
  
  page.drawText("Payment is due within 30 days of invoice date.", {
    x: 50,
    y: footerY - 25,
    size: 9,
    font,
    color: secondaryColor,
  });

  const pdfBytes = await pdfDoc.save();
  
  const fileName = `invoice-order-${orderId}-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(fileName, pdfBytes, { contentType: "application/pdf" });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage
    .from("invoices")
    .getPublicUrl(fileName);

  const pdfUrl = urlData.publicUrl;

  const { rows: invoiceRows } = await pool.query(
    `INSERT INTO invoices (order_id, total_amount, currency, pdf_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [orderId, total.toFixed(2), order.currency, pdfUrl],
  );

  return invoiceRows[0];
};