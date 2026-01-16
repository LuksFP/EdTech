import jsPDF from 'jspdf';
import { Course, Enrollment } from '@/types';

interface CertificateData {
  userName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  courseDuration: string;
}

export const generateCertificatePDF = (data: CertificateData): void => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient effect with border
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setDrawColor(147, 197, 253);
  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner decorations
  const cornerSize = 20;
  doc.setFillColor(59, 130, 246);
  
  // Top left corner
  doc.triangle(10, 10, 10 + cornerSize, 10, 10, 10 + cornerSize, 'F');
  // Top right corner
  doc.triangle(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10 + cornerSize, 'F');
  // Bottom left corner
  doc.triangle(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10, 10, pageHeight - 10 - cornerSize, 'F');
  // Bottom right corner
  doc.triangle(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize, 'F');

  // Header icon (book symbol)
  doc.setFillColor(59, 130, 246);
  doc.circle(pageWidth / 2, 35, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('📚', pageWidth / 2 - 5, 39);

  // Title
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE CONCLUSÃO', pageWidth / 2, 60, { align: 'center' });

  // Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Este certificado é concedido a', pageWidth / 2, 78, { align: 'center' });

  // Student name
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName, pageWidth / 2, 95, { align: 'center' });

  // Decorative line under name
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  const nameWidth = doc.getTextWidth(data.userName);
  doc.line(pageWidth / 2 - nameWidth / 2 - 10, 100, pageWidth / 2 + nameWidth / 2 + 10, 100);

  // Completion text
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('pela conclusão com êxito do curso', pageWidth / 2, 115, { align: 'center' });

  // Course name
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`"${data.courseName}"`, pageWidth / 2, 130, { align: 'center' });

  // Instructor and duration info
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ministrado por: ${data.instructorName}`, pageWidth / 2, 145, { align: 'center' });
  doc.text(`Carga horária: ${data.courseDuration}`, pageWidth / 2, 153, { align: 'center' });

  // Footer section with date and signature
  const footerY = pageHeight - 45;

  // Date
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.text(`Emitido em: ${data.completionDate}`, 50, footerY);

  // Signature line
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 120, footerY - 5, pageWidth - 40, footerY - 5);
  doc.setFontSize(10);
  doc.text('EdTech Platform', pageWidth - 80, footerY + 2, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Assinatura Digital', pageWidth - 80, footerY + 8, { align: 'center' });

  // EdTech branding
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EdTech', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Verification text
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Este certificado foi gerado eletronicamente e é válido sem assinatura física.', pageWidth / 2, pageHeight - 14, { align: 'center' });

  // Save the PDF
  const fileName = `Certificado_${data.courseName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.userName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};

export const downloadCertificate = (
  course: Course,
  enrollment: Enrollment,
  userName: string
): void => {
  const completionDate = enrollment.completedAt 
    ? new Date(enrollment.completedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  generateCertificatePDF({
    userName,
    courseName: course.title,
    instructorName: course.instructor,
    completionDate,
    courseDuration: course.duration
  });
};
