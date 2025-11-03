export type ItemStatus = "submitted" | "approved" | "archived";

export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: ItemStatus;
  image: string;
  officeInfo: string; // 🔹 Added
}

// 🔹 Fake item list
export const mockItems: Item[] = [
  {
    id: "1",
    title: "Black Wallet",
    description: "Lost near the entrance of Building D. Contains several cards and some cash.",
    location: "Building D, Ground Floor",
    date: "2024-04-18T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 1, Building D, 10:00 - 16:00",
  },
  {
    id: "2",
    title: "Set of Keys",
    description: "A set of car and apartment keys found outside the cafeteria.",
    location: "Building A, Cafeteria",
    date: "2024-04-20T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 3, Building A, 09:00 - 15:30",
  },
  {
    id: "3",
    title: "Blue Backpack",
    description: "Contains a laptop and several textbooks. Left in the library. library library library library library library library library Contains a laptop and several textbooks. Contains a laptop and several textbooks. Contains a laptop and several textbooks. Contains a laptop and several textbooks. Contains a laptop and several textbooks.Contains a laptop and several textbooks. Contains a laptop and several textbooks.",
    location: "Library, 2nd Floor", 
    date: "2024-04-15T17:45:00",
    status: "approved",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 2, Building C, 10:00 - 18:00",
  },
  {
    id: "4",
    title: "Smartphone",
    description: "Black iPhone with a cracked screen. Found in the lecture hall.",
    location: "Building B, Room 202",
    date: "2024-04-16T18:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 4, Building B, 09:30 - 17:00",
  },
  {
    id: "5",
    title: "Silver Bracelet",
    description: "Elegant bracelet found in women's restroom.",
    location: "Building D, Restroom",
    date: "2024-04-17T17:45:00",
    status: "approved",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 1, Building D, 10:00 - 16:00",
  },
  {
    id: "6",
    title: "Textbook: Calculus I",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "archived",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
  {
    id: "7",
    title: "Textbook: Calculus 2",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
  {
    id: "8",
    title: "Textbook: Calculus 3",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
  {
    id: "9",
    title: "Textbook: Calculus 4",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
  {
    id: "10",
    title: "Textbook: Calculus 5",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
  {
    id: "11",
    title: "Textbook: Calculus 5",
    description: "Hardcover textbook found in study room C.",
    location: "Building F, Study Room C",
    date: "2024-04-15T17:45:00",
    status: "submitted",
    image: "https://via.placeholder.com/80",
    officeInfo: "Office 5, Building F, 08:00 - 14:00",
  },
];