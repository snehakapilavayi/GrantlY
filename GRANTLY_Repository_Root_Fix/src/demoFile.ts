// A valid, entirely fictional PDF generated in the browser for the evaluator flow.
export function demoFile(name: string) {
  const text = `GRANTLY DEMO - ${name.replace(/[^a-zA-Z ]/g, "")} - NOT A REAL DOCUMENT`;
  const stream = `BT /F1 15 Tf 45 740 Td (${text}) Tj 0 -35 Td /F1 11 Tf (Sample attachment for interface demonstration only.) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n \n")
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new File([pdf], `${name.toLowerCase().replace(/ /g, "-")}-demo.pdf`, {
    type: "application/pdf",
  });
}
