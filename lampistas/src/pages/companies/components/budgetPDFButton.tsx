import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf
} from "@react-pdf/renderer";
import api from "../../../api/intercepttors"; // Asegúrate de importar tu api
import toast from "react-hot-toast";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 3, // Más grueso
    borderBottomColor: "#f59e0b", // Color amber
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f59e0b", // Amber
    color: "#fff", // Texto blanco
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: 1,
    borderBottomColor: "#e0e0e0",
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "right" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: 3,
    borderTopColor: "#f59e0b",
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f59e0b", // Color amber para el total
  },
});
interface BudgetPDFButtonProps {
  budgetData : BudgetData;
  enctype?: string;
}
interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BudgetData {
  budgetNumber: string;
  clientID: number;
  budgetTitle: string;
  date: string;
  companyName: string;
  items: BudgetItem[];
  subtotal: number;
  tax: number;
  total: number;
}
    
// Componente del documento PDF
const BudgetDocument = ({ data }: { data: BudgetData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PRESUPUESTO</Text>
        <Text style={styles.subtitle}>Nº {data.budgetNumber}</Text>
      </View>
       <View style={styles.section}>
        <View style={styles.row}></View>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{data.budgetTitle}</Text>
      </View>

      {/* Company Info */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Empresa:</Text>
          <Text style={styles.value}>{data.companyName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{data.date}</Text>
        </View>
      </View>

      {/* Client Info */}
     
      <View style={styles.section}>
        <View style={styles.row}></View>
        <Text style={styles.label}>ID Cliente:</Text>
        <Text style={styles.value}>{data.clientID}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Descripción</Text>
          <Text style={styles.col2}>Cantidad</Text>
          <Text style={styles.col3}>P. Unitario</Text>
          <Text style={styles.col4}>Total</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{item.unitPrice.toFixed(2)}€</Text>
            <Text style={styles.col4}>{item.total.toFixed(2)}€</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.footer}>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text>{data.subtotal.toFixed(2)}€</Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>IVA (21%):</Text>
          <Text>{data.tax.toFixed(2)}€</Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>{data.total.toFixed(2)}€</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Componente botón de descarga
export default function BudgetPDFButton({
  budgetData,
}: {
  budgetData: BudgetData;
}) {
  const handleDownloadAndUpload = async () => {
    try {
      // 1. Generar el PDF como blob
      const blob = await pdf(<BudgetDocument data={budgetData} />).toBlob();
      
      // 2. Crear FormData para subir a Cloudflare
      const formData = new FormData();
      formData.append('file', blob, `budget_${budgetData.budgetNumber}.pdf`);
      formData.append('budgetNumber', budgetData.budgetNumber);
      
      // 3. Subir a tu backend/Cloudflare
      const token = localStorage.getItem("companyToken");
      
      const response = await api.post('/company/uploadFile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }).then(res => res.data).catch(err => {
        throw new Error("Error subiendo el PDF");
      });
      
      console.log('PDF subido con éxito:', response);
      
      toast.success("PDF generado y subido exitosamente!");
      
      // 4. También descargar localmente (opcional)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `budget_${budgetData.budgetNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error("Error al generar o subir el PDF");
    }
  };

  return (
    <button 
      onClick={handleDownloadAndUpload} 
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
    >
      Crear y enviar presupuesto 
    </button>
  );
}
