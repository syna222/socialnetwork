import axios from 'axios';

export async function sendMessage(senderId, recipientId, text) {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  try {
    // Create the message
    const response = await axios.post(`${baseURL}/nachrichten`, {
      von: senderId,
      an: recipientId,
      text: text,
    });

    const messageId = response.data._id;

    //save sender's id in recipient's "interaktion" array field
    await axios.post(`${baseURL}/users/${recipientId}/addinterlocutor`, {
        interlocId: senderId
    });

    //save recipient's id in sender's "interaktion" array field
    await axios.post(`${baseURL}/users/${senderId}/addinterlocutor`, {
        interlocId: recipientId
    });

    return messageId;
  } catch (error) {
    throw error;
  }
}
