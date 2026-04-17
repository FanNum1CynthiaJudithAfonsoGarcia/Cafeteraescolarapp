import { printer as ThermalPrinter, types, CharacterSet } from 'node-thermal-printer';

export interface PedidoTicket {
  id: number;
  nombreCliente: string;
  horario: string;
  items: Array<{
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  total: number;
  fechaPedido: Date;
}

const ANCHO = 42; // columnas para papel de 80mm

/** Formatea una línea "NxNombre    precio€" ajustando espacios */
function lineaProducto(cantidad: number, nombre: string, importe: number): string {
  const izq = `${cantidad}x ${nombre}`;
  const der = `${importe.toFixed(2)}\u20AC`; // €
  const espacios = Math.max(1, ANCHO - izq.length - der.length);
  return `${izq}${' '.repeat(espacios)}${der}`;
}

export async function imprimirTicket(pedido: PedidoTicket): Promise<void> {
  const ip = process.env.PRINTER_IP;
  const port = Number(process.env.PRINTER_PORT ?? 9100);

  if (!ip) {
    console.warn('[Impresora] PRINTER_IP no configurada — impresión omitida.');
    return;
  }

  const printer = new ThermalPrinter({
    type: types.EPSON,           // ESC/POS estándar para la mayoría de térmicas
    interface: `tcp://${ip}:${port}`,
    characterSet: CharacterSet.PC850_MULTILINGUAL, // soporte ñ, á, é, etc.
    removeSpecialCharacters: false,
    lineCharacter: '-',
    width: ANCHO,
    options: {
      timeout: 5000, // 5s de timeout de conexión
    },
  });

  // ── Verificar conexión ────────────────────────────────────
  let conectado = false;
  try {
    conectado = await printer.isPrinterConnected();
  } catch {
    conectado = false;
  }

  if (!conectado) {
    console.warn(`[Impresora] Sin conexión en ${ip}:${port} — ticket no impreso.`);
    return;
  }

  const fecha = pedido.fechaPedido;
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const horaStr = fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  });

  // ── Componer ticket ───────────────────────────────────────
  printer.alignCenter();
  printer.bold(true);
  printer.setTextDoubleHeight();
  printer.println('CAFETERIA ESCOLAR');
  printer.setTextNormal();
  printer.bold(false);
  printer.drawLine();

  printer.alignLeft();
  printer.println(`Pedido : PED-${pedido.id}`);
  printer.println(`Fecha  : ${fechaStr}  ${horaStr}`);
  printer.println(`Cliente: ${pedido.nombreCliente}`);
  if (pedido.horario && pedido.horario !== 'N/A') {
    printer.println(`Recogida: ${pedido.horario}`);
  }
  printer.drawLine();

  for (const item of pedido.items) {
    printer.println(
      lineaProducto(item.cantidad, item.nombre, item.precioUnitario * item.cantidad)
    );
  }

  printer.drawLine();
  printer.bold(true);
  printer.alignRight();
  printer.println(`TOTAL: ${pedido.total.toFixed(2)}\u20AC`);
  printer.bold(false);

  printer.alignCenter();
  printer.println('');
  printer.println('Recoge en el mostrador');
  printer.println('\u00A1Gracias!');
  printer.println('');
  printer.println('');
  printer.cut();

  await printer.execute();
  printer.clear();

  console.log(`[Impresora] Ticket PED-${pedido.id} enviado a ${ip}:${port}`);
}
