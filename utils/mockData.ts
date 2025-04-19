export const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment with Balcony',
    location: 'Downtown, New York',
    price: 2500,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    area: 850,
    imageUrl: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    isFavorite: false
  },
  {
    id: 2,
    title: 'Luxurious Penthouse with City View',
    location: 'Upper East Side, New York',
    price: 4200,
    type: 'Penthouse',
    beds: 3,
    baths: 3,
    area: 1300,
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    isFavorite: true
  },
  {
    id: 3,
    title: 'Cozy Studio Near Park',
    location: 'Brooklyn, New York',
    price: 1800,
    type: 'Studio',
    beds: 1,
    baths: 1,
    area: 550,
    imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    isFavorite: false
  },
  {
    id: 4,
    title: 'Renovated Brownstone House',
    location: 'Park Slope, Brooklyn',
    price: 3500,
    type: 'House',
    beds: 4,
    baths: 2,
    area: 1500,
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    isFavorite: false
  },
  {
    id: 5,
    title: 'Spacious Loft with High Ceilings',
    location: 'SoHo, Manhattan',
    price: 3200,
    type: 'Loft',
    beds: 2,
    baths: 2,
    area: 1100,
    imageUrl: 'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg',
    isFavorite: false
  }
];

export const mockChats = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'I can show you the apartment tomorrow at 3 PM if that works for you.',
    time: '10:30 AM',
    unread: true,
    unreadCount: 2,
    online: true
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'We just received your application. We\'ll get back to you soon.',
    time: 'Yesterday',
    unread: false,
    unreadCount: 0,
    online: false
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'The rent includes all utilities except for electricity.',
    time: 'Yesterday',
    unread: false,
    unreadCount: 0,
    online: true
  },
  {
    id: 4,
    name: 'Emily Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    lastMessage: 'Great! I\'ll send over the lease agreement for you to review.',
    time: 'Apr 20',
    unread: true,
    unreadCount: 1,
    online: false
  },
  {
    id: 5,
    name: 'David Lee',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    lastMessage: 'Yes, pets are allowed with an additional security deposit.',
    time: 'Apr 18',
    unread: false,
    unreadCount: 0,
    online: false
  }
];

export const mockAgreements = [
  {
    id: 1,
    propertyTitle: 'Modern Apartment',
    address: '123 Main St, Apt 4B, New York',
    propertyImage: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    rent: 2500,
    duration: '12 months',
    status: 'Active',
    date: 'Jan 15, 2025',
    landlordName: 'John Smith',
    startDate: '2025-01-15',
    endDate: '2026-01-14'
  },
  {
    id: 2,
    propertyTitle: 'Renovated Studio',
    address: '456 Park Ave, Studio 7, Brooklyn',
    propertyImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    rent: 1800,
    duration: '6 months',
    status: 'Pending',
    date: 'Apr 25, 2025',
    landlordName: 'Sarah Wilson',
    startDate: '2025-05-01',
    endDate: '2025-10-31'
  },
  {
    id: 3,
    propertyTitle: 'Downtown Loft',
    address: '789 Broadway, Loft 3C, Manhattan',
    propertyImage: 'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg',
    rent: 3200,
    duration: '24 months',
    status: 'Expired',
    date: 'Mar 10, 2024',
    landlordName: 'Michael Brown',
    startDate: '2023-03-10',
    endDate: '2025-03-09'
  }
];