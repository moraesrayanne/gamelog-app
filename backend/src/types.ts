// Define o contrato exato dos dados que manipularemos (um Jogo Zerado)
export interface Game {
    id: string; // UUID (String única)
    title: string;
    hours: number;
}

// Define o formato esperado no corpo das requisições POST/PUT (Payload)
export interface GamePayload {
    title: string;
    hours: number;
}