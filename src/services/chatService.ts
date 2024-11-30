import Cookies from "js-cookie";

const token = Cookies.get("token");

export const BuscarConvites = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}invites/all/${userId}`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  return response.json();
};

export const EnviarConvite = async (userId: number, recepId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}invites/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId: recepId, receiverId: userId }),
      credentials: "include",
    }
  );

  return response;
};

export const AcceptConvite = async (invitationId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}invites/accept/${invitationId}`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  return response;
};
export const RecusedConvite = async (invitationId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}invites/decline/${invitationId}`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  return response;
};

export const BuscarConversa = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}conversations/user?userId=${userId}`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  return response.json();
};

export const SelecionarConversa = async (conversationId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}messages/conversation?conversationId=${conversationId}`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  return response;
};

export const CriarConverse = async (userId: number, recepId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}conversations/create`,
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

  return response;
};
