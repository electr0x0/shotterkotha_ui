export const mockPosts = {
  1: {
    id: "1",
    title: "Suspicious Activity in Gulshan-2",
    content:
      "Multiple reports of suspicious individuals near residential areas. Please be vigilant and report any suspicious behavior to local authorities.",
    user: {
      name: "John Doe",
      image: null,
      isVerified: true,
    },
    timeAgo: "2 hours ago",
    location: "Gulshan-2",
    division: "Dhaka",
    stats: {
      upvotes: 150,
      downvotes: 10,
      comments: 45,
    },
    media: {
      type: "photo",
      url: "https://picsum.photos/800/600",
      aiDescription:
        "The image shows a well-lit residential street in an upscale neighborhood. Several individuals can be seen loitering near parked vehicles, exhibiting behavior that appears out of the ordinary. The time stamp indicates this was captured during evening hours, and security cameras are visible in the frame.",
    },
    isEditable: true,
    type: "SUSPICIOUS_ACTIVITY",
    status: "UNRESOLVED",
    severity: "HIGH",
  },
  2: {
    id: "2",
    title: "Car Theft Attempt at Banani",
    content:
      "Today at around 3 PM, there was an attempted car theft in Banani Block A. The suspects were seen trying to break into a parked Toyota Corolla.",
    user: {
      name: "Jane Smith",
      image: null,
      isVerified: false,
    },
    timeAgo: "5 hours ago",
    location: "Banani",
    division: "Dhaka",
    stats: {
      upvotes: 89,
      downvotes: 3,
      comments: 23,
    },
    media: {
      type: "photo",
      url: "https://picsum.photos/800/601",
      aiDescription:
        "The image depicts a silver Toyota Corolla parked on a street in what appears to be a residential area. There are visible signs of attempted forced entry on the driver's side door lock. The surrounding area shows multiple security cameras and street lighting, suggesting this is a well-monitored location.",
    },
    isEditable: false,
    type: "THEFT",
    status: "UNRESOLVED",
    severity: "MEDIUM",
  },
  3: {
    id: "3",
    title: "Missing Pet in Dhanmondi",
    content:
      "Our golden retriever went missing from Road 27. He's wearing a blue collar with contact information. Please contact if found.",
    user: {
      name: "Sarah Khan",
      image: null,
      isVerified: true,
    },
    timeAgo: "1 day ago",
    location: "Dhanmondi",
    division: "Dhaka",
    stats: {
      upvotes: 245,
      downvotes: 0,
      comments: 78,
    },
    media: {
      type: "photo",
      url: "https://picsum.photos/800/602",
      aiDescription:
        "The photograph shows a friendly-looking golden retriever with a distinctive blue collar. The dog appears to be medium-sized with a well-groomed golden coat. The image was taken in what seems to be a residential area with trees and buildings visible in the background. The collar has visible tags that likely contain contact information.",
    },
    isEditable: false,
    type: "MISSING",
    status: "UNRESOLVED",
    severity: "LOW",
  },
};

export const getMockPost = (id) => {
  return mockPosts[id] || null;
};

// Helper function to get all posts
export const getAllMockPosts = () => {
  return Object.values(mockPosts);
};
