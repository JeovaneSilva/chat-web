const getCookie = (name: string): string | null => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

const token = getCookie("token");

export const BuscarConvites = async (userId:number) => {
    const response = await fetch(
        `http://localhost:3333/invites/all/${userId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      return response.json()
}

export const EnviarConvite = async (userId:number,recepId:number) => {
    const response = await fetch("http://localhost:3333/invites/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId: recepId, receiverId: userId }),
        credentials: "include",
      });

      return response
}

export const AcceptConvite = async (invitationId:number) => {
    const response = await fetch(
        `http://localhost:3333/invites/accept/${invitationId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      return response
}

export const BuscarConversa = async (userId:number) => {
    const response = await fetch(
        `http://localhost:3333/conversations/user?userId=${userId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      return response.json()
}

export const SelecionarConversa = async (conversationId:number) => {
    const response = await fetch(
        `http://localhost:3333/messages/conversation?conversationId=${conversationId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      return response
}

export const CriarConverse = async (userId:number,recepId:number) => {
    const response = await fetch(
        "http://localhost:3333/conversations/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Adicionando o Content-Type
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user1Id: userId, // Aqui você estava passando 'userId' em vez de 'senderId'
            user2Id: recepId,
          }),
          credentials: "include",
        }
      );

      return response
}




