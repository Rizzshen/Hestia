import supabase from "../config/supabase.js";
import pool from "../config/db.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generateInvoices = async (orderId) => {
  const { rows: orderRows } = await pool.query(
    "SELECT orders.*, clients.company_name, clients.contact_name, clients.email, clients.currency from orders INNER JOIN clients on orders.client_id = clients.id WHERE orders.id = $1",
    [orderId],
  );
  if (!orderRows[0]) return null;
  const { rows: items } = await pool.query(
    "SELECT oi.quantity, oi.unit_price_at_time, p.name AS product_name from order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
    [orderId],
  );
  const total = items.reduce((sum, item) => {
    return (sum + (item.unit_price_at_time * item.quantity) );
  }, 0);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const order = orderRows[0];
  page.drawText("INVOICE", {
    x: 50,
    y: 780,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Order #${order.id}`, { x: 50, y: 750, size: 12, font });
  page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString()}`, {
    x: 50,
    y: 730,
    size: 12,
    font,
  });

  // Client info
  page.drawText(`Client: ${order.company_name}`, {
    x: 50,
    y: 700,
    size: 12,
    font,
  });
  page.drawText(`Contact: ${order.contact_name}`, {
    x: 50,
    y: 680,
    size: 12,
    font,
  });
  page.drawText(`Email: ${order.email}`, { x: 50, y: 660, size: 12, font });

  // Items header
  page.drawText("Product", { x: 50, y: 620, size: 12, font });
  page.drawText("Qty", { x: 300, y: 620, size: 12, font });
  page.drawText("Unit Price", { x: 380, y: 620, size: 12, font });
  page.drawText("Subtotal", { x: 470, y: 620, size: 12, font });

  // Items
  let y = 600;
  for (const item of items) {
    const subtotal = item.unit_price_at_time * item.quantity;
    page.drawText(item.product_name, { x: 50, y, size: 11, font });
    page.drawText(String(item.quantity), { x: 300, y, size: 11, font });
    page.drawText(`${order.currency} ${item.unit_price_at_time}`, {
      x: 380,
      y,
      size: 11,
      font,
    });
    page.drawText(`${order.currency} ${subtotal.toFixed(2)}`, {
      x: 470,
      y,
      size: 11,
      font,
    });
    y -= 20;
  }

  // Total
  page.drawText(`Total: ${order.currency} ${total.toFixed(2)}`, {
    x: 380,
    y: y - 20,
    size: 14,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  // upload to Supabase Storage
  const fileName = `invoice-order-${orderId}-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(fileName, pdfBytes, { contentType: "application/pdf" });

  if (uploadError) throw new Error(uploadError.message);

  // get public URL
  const { data: urlData } = supabase.storage
    .from("invoices")
    .getPublicUrl(fileName);

  const pdfUrl = urlData.publicUrl;

  // save invoice record to DB
  const { rows: invoiceRows } = await pool.query(
    `INSERT INTO invoices (order_id, total_amount, currency, pdf_url)
   VALUES ($1, $2, $3, $4) RETURNING *`,
    [orderId, total.toFixed(2), orderRows[0].currency, pdfUrl],
  );

  return invoiceRows[0];
};
