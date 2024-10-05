export interface Invite {
  id: number;
  receiverId: number;
  senderId: number;
  status: string;
  receiver: {
    name: string;
    profilePicture: string;
  };
  sender: {
    name: string;
    profilePicture: string;
  };
}
