export const formatarData = (dataISO: string) => {
    // Converta a string para um objeto Date
    const data = new Date(dataISO);

    // Extraia os valores desejados
    const hora = data.getUTCHours().toString().padStart(2, "0"); // Horas formatadas (00-23)
    const minutos = data.getUTCMinutes().toString().padStart(2, "0"); // Minutos formatados (00-59)
    const dia = data.getUTCDate().toString().padStart(2, "0"); // Dia do mês (01-31)
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0"); // Mês formatado (01-12)
    const ano = data.getUTCFullYear(); // Ano completo

    // Retorne os valores formatados
    return `${hora}:${minutos}`;
  };