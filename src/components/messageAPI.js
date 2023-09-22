import axios from 'axios';

export async function sendMessage(senderId, recipientId, subject, text) {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  try {
    // Create the message
    const response = await axios.post(`${baseURL}/nachrichten`, {
      von: senderId,
      an: recipientId,
      betreff: subject,
      text: text,
    });

    const messageId = response.data._id;

    // Save the message in the sender's sent messages
    await axios.post(`${baseURL}/users/${senderId}/addnachrichtsender`, {
      messageid: messageId,
    });

    // Save the message in the recipient's received messages
    await axios.post(`${baseURL}/users/${recipientId}/addnachrichtrec`, {
      messageid: messageId,
    });

    return messageId;
  } catch (error) {
    throw error;
  }
}
