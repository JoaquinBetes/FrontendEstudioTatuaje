export interface Tatuador {
  contraseña: string;
  dni: number;
  email: string;
  redesSociales: string;
  nombreCompleto: string;
  telefono: number;
  turnos: any[];
}
export interface Cliente {
  contraseña: string;
  dni: number;
  email: string;
  estado: number;
  nombreCompleto: string;
  telefono: number;
  turnos: any[];
}

export interface ResponseTatuadores {
  message: string;           // Mensaje que describe la respuesta
  data: Tatuador[];         // Lista de tatuadores
}

export interface ClienteResponse {
    message: string;
    data: {
      contraseña: string;
      dni: number;
      email: string;
      estado: number;
      nombreCompleto: string;
      telefono: number;
      turnos: any[];
    };
  }

  export interface TatuadorResponse {
    message: string;
    data: {
      contraseña: string;
      dni: number;
      email: string;
      redesSociales: string;
      nombreCompleto: string;
      telefono: number;
      turnos: any[];
    };
  }

  export interface DatoSucursal {
    nombreDato: 'pais' | 'localidad' | 'direccion' | 'departamento' | 'piso'; // Claves específicas
    dato: string | number | null;
  }

  export interface DatoHorariosAtencion {
    id: number;
    dia_semana: string;       
    hora_apertura: number;    
    hora_cierre: number;      
  }

  export interface Categoria {
    codigo: number;
    descripcion: string;
  }

  interface Imagen {
    type: string;
    data: number[];
    base64String?: any;
  }

  export interface Diseño {
    id: number;
    categoria: Categoria;
    tatuador: Tatuador;
    imagen: string;
    descuento: number;
    precioBase: number;
    precioFinal?: number;
    tamanioAproximado: number;
    colores: string;
    estado: string;
    turno?: any;
  }

  export interface Turno {
    hora_inicio: string;     // Hora de inicio del turno (como string, formato "HH:MM:SS")
    hora_fin: string; 
    fecha_turno: Date;      // Fecha del turno
    tatuador_dni: number;    // Tatuador asociado al turno
    cliente_dni: number;      // Cliente que reservó el turno
    diseño_id: number;       
    indicaciones: string;  // Indicaciones para el tatuador
    estado: string;        // Estado del turno (por ejemplo, "ACT", "CAN", etc.)
  }
  export interface TurnoResponse {
    message: string;
    data: Turno
  }