import { GoogleGenAI, Type, FunctionDeclaration, Tool, Chat } from "@google/genai";
import { MENU_ITEMS } from '../constants';

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// -- Tool Definitions --

const showMenuTool: FunctionDeclaration = {
  name: 'showMenu',
  description: 'Display the restaurant menu visually to the user. Use this when the user asks to see the menu, what food is available, or specific categories.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category filter (main, dessert, drink)',
      }
    },
  },
};

const addToOrderTool: FunctionDeclaration = {
  name: 'addToOrder',
  description: 'Add an item to the user\'s cart/order. Use this when the user explicitly says they want to order something.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemName: {
        type: Type.STRING,
        description: 'The exact name of the item from the menu',
      },
      quantity: {
        type: Type.NUMBER,
        description: 'Quantity of the item',
      }
    },
    required: ['itemName', 'quantity'],
  },
};

const showBillTool: FunctionDeclaration = {
  name: 'showBill',
  description: 'Display the current bill or cart summary visually. Use when user asks for the bill, check out, or view cart.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const makeReservationTool: FunctionDeclaration = {
  name: 'makeReservation',
  description: 'Open the reservation form or confirm a reservation. Use when user wants to book a table.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      prefillName: { type: Type.STRING },
      prefillDate: { type: Type.STRING },
      prefillTime: { type: Type.STRING },
      prefillPax: { type: Type.NUMBER },
    },
  },
};

const tools: Tool[] = [{
  functionDeclarations: [showMenuTool, addToOrderTool, showBillTool, makeReservationTool]
}];

// -- Chat Initialization --

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Kagay-an Bot', the warm and friendly virtual assistant for 'Golden Friendship Feast', a premier restaurant in Cagayan de Oro City.
      
      Your personality:
      - You speak English mixed with polite Kagay-anon local dialect words (e.g., use 'Chada!' for great, 'Salamat' for thanks, 'Amping' for take care, 'Maayong adlaw' for good day).
      - You are helpful, enthusiastic about food, and professional.
      
      Your Goal:
      - Help users order food, book tables, and answer questions.
      
      The Menu:
      ${JSON.stringify(MENU_ITEMS.map(i => ({ name: i.name, price: i.price, desc: i.description })))}
      
      Capabilities:
      - Always use the provided tools to perform actions like showing the menu, adding items to the order, or showing the bill.
      - If a user wants to order, find the closest matching item name and call 'addToOrder'.
      - If a user asks for the menu, call 'showMenu'.
      - If a user asks for the bill, call 'showBill'.
      - If a user wants to reserve a table, call 'makeReservation'.
      
      Do not hallucinate menu items not on the list. If you are unsure, show the menu.`,
      tools: tools,
    },
  });
};