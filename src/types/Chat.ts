export interface Conversation {
    id: number;
    user1Id: number;
    user2Id: number;
    user1: {
      name: string;
      profilePicture: string;
    };
    user2: {
      name: string;
      profilePicture: string;
    };
  }
  
 export interface Message {
    id: number;
    content: string;
    senderId: number;
    conversationId: number;
    createdAt: string
  }